import json
import os
import time
from pathlib import Path

from fastapi import HTTPException
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS

from interfaces.data_classes import ApiUserPayloads, ApiAdminPayloads, ApiEntryMemory
from modules.get_data_module import get_data
from modules.get_init_answer import get_init_answer
from modules.get_stream_answer import stream_answer
from util import load_source_cache, save_source, text_to_chunks
from dotenv import load_dotenv

load_dotenv()
emb_config_list = json.loads(os.getenv("EMB_CONFIG_LIST"))


async def source_data_handle(data_source: ApiAdminPayloads):
    try:
        text = get_data(data_source.files, data_source.urls)
        text_documents = text_to_chunks(text)
        faiss_vectorstore = FAISS.from_documents(text_documents,
                                                 OllamaEmbeddings(base_url=emb_config_list[0]["base_url"],
                                                                  model=emb_config_list[0]["model"]))
        save_path = Path(f"./data/{data_source.company_name.strip().lower()}")
        save_source(faiss_vectorstore, text_documents, save_path)
        print("Get valid data source")
        return True
    except:
        print("Invalid data source")
        return False


async def qa_initiate_function(qa_init: ApiUserPayloads) -> ApiUserPayloads:
    if len(qa_init.qa_history) == 0:
        raise HTTPException(status_code=400, detail=f"Provide a question")
    init_question = "\n\n#########################\n\n".join(
        [f"{messages.message}" for messages in qa_init.qa_history])

    vector_store, text_documents = load_source_cache(Path(f"./data/{qa_init.company_name.lower()}"))
    answer_data = get_init_answer(init_question, text_documents, vector_store)

    qa_init.answer = ApiEntryMemory(user="agent", message=answer_data)
    return qa_init


def qa_stream_function(qa_init: ApiUserPayloads):
    if len(qa_init.qa_history) == 0:
        raise HTTPException(status_code=400, detail=f"Provide a question")
    init_question = "\n\n#########################\n\n".join(
        [f"{messages.user}\n{messages.response}" for messages in qa_init.qa_history])

    vector_store, text_documents = load_source_cache(Path(f"./data/{qa_init.company_name.lower()}"))
    for chunk in stream_answer(init_question, text_documents, vector_store):
        # Format as proper NDJSON
        yield create_json_response("streaming", chunk)

    yield create_json_response("complete")


def create_json_response(status, data=""):
    return json.dumps({
        "status": status,
        "data": data,
        "timestamp": time.time()
    }, ensure_ascii=False) + "\n"


def qa_stream(reg_chat_init: ApiUserPayloads):
    for e in qa_stream_function(reg_chat_init):
        yield e
