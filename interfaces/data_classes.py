from pydantic import BaseModel
from scipy.constants import blob


class GitBlob(BaseModel):
    content: bytes
    path: str

    @classmethod
    def from_blob(cls, blob):
        return cls(content=blob.data_stream.read(), path=blob.path)


class ApiAdminPayloads(BaseModel):
    company_name: str
    urls: list[str]
    files: list[bytes] = []


class ApiEntryMemory(BaseModel):
    user: str
    response: str


class ApiUserPayloads(BaseModel):
    company_name: str
    qa_history: list[ApiEntryMemory]
    answer: ApiEntryMemory = None
