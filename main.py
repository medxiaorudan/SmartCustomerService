import logging
from typing import Annotated

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, StreamingResponse
from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.responses import JSONResponse

from handler import qa_initiate_function, qa_stream, source_data_handle
from interfaces.data_classes import ApiAdminPayloads, ApiUserPayloads
from fastapi.middleware.cors import CORSMiddleware



tags_metadata = [
    {
        "name": "Admin Upload",
        "description": "Admin upload company information"
    },
    {
        "name": "User Chat",
        "description": "User start chatting with smart customer services"
    },
    {
        "name": "User Chat Stream",
        "description": "User start chatting with smart customer services in stream"
    }
]

app = FastAPI(openapi_tags=tags_metadata)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def auth(request: Request):
    # Get the Authorization header
    auth_header = request.headers.get("Authorization")
    print(auth_header)

    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    return auth_header == 'abc123'

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("headers", request.headers, "\n")
    print("query_params", request.query_params, "\n")
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    logging.error(f"{request}: {exc_str}")
    content = {'status_code': 10422, 'message': exc_str, 'data': None}
    return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


@app.get("/hello_world", tags=["Test"])
async def hello_world(request: Request):
    print("data_handle")
    return "World"

@app.put("/admin/input_data", tags=["Admin Upload"])
async def data_handle(input_data: ApiAdminPayloads, request: Request):
    print("data_handle")
    if not auth(request):
        return HTTPException(status_code=401, detail="Unauthorized")
    print("after auth")

    valid_source_data = await source_data_handle(input_data)

    if not valid_source_data:
        return HTTPException(status_code=404, detail="Invalid input data source")


@app.put("/user/chat", tags=["User Chat"])
async def qa_chat(qa_data: ApiUserPayloads) -> ApiUserPayloads:
    ret = await qa_initiate_function(qa_data)
    ApiUserPayloads.model_validate(ret.model_dump(), strict=True)
    return ret


@app.post("/user/chat_stream", tags=["User Chat Stream"])
async def qa_chat_streamed(data: ApiUserPayloads):
    return StreamingResponse(
        qa_stream(data),
        media_type="application/x-ndjson",
        headers={
            "X-Accel-Buffering": "no"  # Disable proxy buffering
        }
    )
