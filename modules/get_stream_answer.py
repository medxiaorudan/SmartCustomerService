import json
import os
from typing import Generator

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from openai import OpenAI
from dotenv import load_dotenv

from util import create_ensemble_retriever

load_dotenv()
deepseek_config_list = json.loads(os.getenv("CONFIG_LIST"))


def stream_answer(question, document, faiss_vectorstore):
    for entry in get_answer(question, document, faiss_vectorstore):
        yield entry


def get_answer(question: str, docs_list: list[Document], faiss_vectorstore: FAISS):
    # Load configuration from environment
    retriever = create_ensemble_retriever(docs_list, faiss_vectorstore)
    chunks = retriever.invoke(question)
    information = "\n".join([chunk.page_content for chunk in chunks])
    # Initialize OpenAI client with Ollama configuration
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
    # Create streaming response
    stream = client.chat.completions.create(
        model=deepseek_config_list[0]["model"],
        messages=messages,
        stream=True,
        temperature=0.7,
        max_tokens=1000
    )

    answer_content = ""
    for chunk in stream:
        if "choices" in chunk and chunk.choices:
            delta = chunk.choices[0].get("delta", {})
            content = delta.get("content")
            if content:
                answer_content += content
                yield content
                print(content, end="", flush=True)


