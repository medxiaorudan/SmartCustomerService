import json

import requests


def test_chat_stream():
    domain = 'http://127.0.0.1:8000'
    endpoint = '/user/chat_stream'

    user_input = {
        "company_name": "tendium",
        "qa_history": [
            {
                "user": "Rudan",
                "response": "What's Tendium working style"
            },
            {
                "user": "agent",
                "response": "Tendium adopts a risk-based approach. This means that it continuously works towards optimizing services by analyzing potential risks in terms of cost management and identifying anticipated consequences. By adopting such an approach, Tendium aims to deliver secure and safe services while ensuring compliance with internal and external routines as per the established policies and guidelines within its organization."
            },
            {
                "user": "Rudan",
                "response": "Translate this into Swedish."
            }
        ]
    }

    with requests.post(
            url=f"{domain}{endpoint}",
            json=user_input,
            stream=True,
            headers={'Accept': 'application/x-ndjson'}
    ) as response:
        print(f"\nResponse status: {response.status_code}")
        print("Response headers:", response.headers)

        for line in response.iter_lines():
            if line:
                try:
                    decoded_line = line.decode('utf-8')
                    event = json.loads(decoded_line)
                    print(f"\nReceived event: {event}")
                except json.JSONDecodeError:
                    print(f"Invalid JSON chunk: {decoded_line}")
                except UnicodeDecodeError:
                    print(f"Decoding error: {line}")


if __name__ == '__main__':
    test_chat_stream()
