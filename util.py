import json
import os

from fastapi.encoders import jsonable_encoder
from langchain_core.documents import Document
from langchain_text_splitters import CharacterTextSplitter
from langchain_text_splitters import RecursiveCharacterTextSplitter

from typing import List, Optional, Tuple
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OllamaEmbeddings
from dotenv import load_dotenv

load_dotenv()
emb_config_list = json.loads(os.getenv("EMB_CONFIG_LIST"))


# def text_to_chunks(text: str) -> list[Document]:
#     text_splitter = CharacterTextSplitter(
#         separator="\n\n",
#         chunk_size=200,
#         chunk_overlap=10
#     )
#     return text_splitter.create_documents([text])
def text_to_chunks(text: str,
                     chunk_size: int = 200,
                     chunk_overlap: int = 20) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", "! ", "? ", " ", ""]
    )
    text_list = splitter.split_text(text)
    return splitter.create_documents(text_list)

def create_ensemble_retriever(
        doc_list: List[Document],
        faiss_vectorstore: FAISS,
        bm25_k: int = 10,
        faiss_k: int = 10,
        weights: Optional[List[float]] = None
) -> EnsembleRetriever:
    """
    Create an ensemble retriever using local Ollama embeddings and BM25/FAISS.

    Args:
        doc_list: Documents for retriever
        bm25_k: Number of BM25 results to return
        faiss_k: Number of FAISS results to return
        weights: Weights for ensemble combination

    Returns:
        Initialized EnsembleRetriever
    """
    # Initialize BM25 retriever
    bm25_retriever = BM25Retriever.from_documents(doc_list)
    bm25_retriever.k = bm25_k

    # Initialize FAISS vector store
    faiss_retriever = faiss_vectorstore.as_retriever(search_kwargs={"k": faiss_k})

    # Set default weights if not provided
    if weights is None:
        weights = [0.2, 0.8]

    return EnsembleRetriever(
        retrievers=[bm25_retriever, faiss_retriever],
        weights=weights
    )


def load_source_cache(company_name, path: os.PathLike):
    try:
        with open(f"{path}/{company_name.lower()}_vector_store", "rb") as file:
            # Use the same local embedding model for deserialization
            vector_store = FAISS.deserialize_from_bytes(
                file.read(),
                OllamaEmbeddings(base_url=emb_config_list[0]["base_url"],
                                 model=emb_config_list[0]["model"])
            )
        with open(f"{path}/{company_name.lower()}_text_documents.json", 'r') as file:
            data = json.load(file)
            text_documents = [Document(**doc) for doc in data]

        print("Loaded from storage")
        return vector_store, text_documents

    except Exception as e:
        print(f"No cache/invalid cache found: {e}")


# save_source remains the same
def save_source(vector_store, text_documents, path, company_name):
    os.makedirs(path, exist_ok=True)

    with open(f"{path}/{company_name.lower()}_vector_store", "wb") as file:
        file.write(vector_store.serialize_to_bytes())

    with open(f"{path}/{company_name.lower()}_text_documents.json", "w") as file:
        json_string = json.dumps(jsonable_encoder(text_documents), indent=4)
        file.write(json_string)
