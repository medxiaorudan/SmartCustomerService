import json
import os

import autogen
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from openai import OpenAI

from util import create_ensemble_retriever
from dotenv import load_dotenv

load_dotenv()
deepseek_config_list = json.loads(os.getenv("CONFIG_LIST"))


def get_init_answer(question: str, docs_list: list[Document], faiss_vectorstore: FAISS) -> str:
    """Generates an answer using AutoGen based on input text (regulatory framework + user question)."""
    retriever = create_ensemble_retriever(docs_list, faiss_vectorstore)
    chunks = retriever.invoke(question)
    information = "\n".join([chunk.page_content for chunk in chunks])
    client = OpenAI(
        base_url=deepseek_config_list[0]["base_url"],
        api_key="ollama"  # API key not typically required for local Ollama
    )
    if information:
        messages = [
            {
                "role": "system",
                "content": "You are a smart customer service agent. Answer the user question with the provided product/company information."
            },
            {
                "role": "user",
                "content": f"Company Information:\n{information}\n\nQuestion: {question}"
            }
        ]
    else:
        messages = [
            {
                "role": "system",
                "content": "You are a smart customer service agent. Answer the user question."
            },
            {
                "role": "user",
                "content": f"Question: {question}"
            }
        ]
    llm_answer = client.chat.completions.create(
        model=deepseek_config_list[0]["model"],
        messages=messages,
        temperature=0.7,
        max_tokens=1000
    ).choices[0].message.content

    return llm_answer
