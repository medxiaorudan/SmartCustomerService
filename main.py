import logging
import os
from pathlib import Path
from types import SimpleNamespace
from typing import Annotated

import jwt
import datetime
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, StreamingResponse
from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.responses import JSONResponse
from flask import jsonify
from jwt import ExpiredSignatureError, InvalidTokenError

from handler import qa_initiate_function, qa_stream, source_data_handle
from interfaces.data_classes import ApiAdminPayloads, ApiUserPayloads, ApiAdminLogIn
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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("headers", request.headers, "\n")
    print("query_params", request.query_params, "\n")
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    logging.error(f"{request}: {exc_str}")
    content = {'status_code': 10422, 'message': exc_str, 'data': None}
    return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


ADMIN_PASSWORD = "abc123"
JWT_SIGNATURE = "banana123"


def get_and_verify_token(password: str):
    if password == ADMIN_PASSWORD:
        # Encode the payload into a JWT token
        payload = {
            'user_id': 1,  # Example user ID
            'username': 'admin',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Expiry time of the token
        }
        token = jwt.encode(payload, JWT_SIGNATURE, algorithm='HS256')
        print("Generated JWT Token:", token)
        return token
    else:
        raise HTTPException(status_code=401, detail="Wrong Password")


def verify_token(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({'message': 'Authorization header missing'}), 400

    jwt_token = auth_header.replace('Bearer ', '')
    print(f"JWT Token received: {jwt_token}")

    try:
        # Decode the token using the secret key
        payload = jwt.decode(jwt_token, JWT_SIGNATURE, algorithms=['HS256'])
        print(f"Decoded JWT Payload: {payload}")

        # Compare the decoded data (example: check if the user_id is correct)
        if payload['user_id'] == 1:
            return True
        else:
            raise HTTPException(status_code=401, detail="Invalid user ID")

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except InvalidTokenError as e:
        print(f"Invalid Token Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")


@app.post("/get_token_test", tags=["JWT Token Test"])
async def get_token_test(login_information: ApiAdminLogIn):
    token = get_and_verify_token(login_information.password)
    dict_request = {"headers": {"Authorization": "Bearer " + token}}
    request = SimpleNamespace(**dict_request)
    verify_token(request)


@app.post("/get_token", tags=["Get Token"])
async def get_token(login_information: ApiAdminLogIn):
    return get_and_verify_token(login_information.password)



@app.put("/admin/input_data", tags=["Admin Upload"])
async def data_handle(input_data: ApiAdminPayloads, request: Request):
    print("data_handle")
    if not verify_token(request):
        raise HTTPException(status_code=401, detail="Unauthorized")
    print("after auth")

    valid_source_data = await source_data_handle(input_data)

    if not valid_source_data:
        raise HTTPException(status_code=404, detail="Invalid input data source")

@app.get("/user/get_companies", tags=["Get Company Name List"])
async def get_company_list() -> list[str]:
    return os.listdir(Path("./data/"))

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
