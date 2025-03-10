const API_PATH = 'http://localhost:8000';
// const API_PATH = 'https://0b01-82-183-1-59.ngrok-free.app';
// const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
let SAVED_TOKEN: string = '-';

export const getToken = async (password: string) => {
   const requestBody = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: password }),
  };
  console.log('Sending getToken', requestBody)

  const response = await fetch(`${API_PATH}/get_token`, requestBody);
  console.log('Login Response', response)


  if (!response.ok) throw new Error("Failed to Login");
  const json = await response.json();
  SAVED_TOKEN = json;
  return json;
}

export const getCompanies = async () => {
  const requestBody = {
   method: "GET",
   headers: { "Content-Type": "application/json" },
 };

 const response = await fetch(`${API_PATH}/user/get_companies`, requestBody);
 return response.json();
}

export async function uploadUrls(companyName: string, urls: string[]) {

  const requestBody = {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SAVED_TOKEN}` },
    body: JSON.stringify({ company_name: companyName, urls:urls }),
  };
  console.log(requestBody)

  const response = await fetch(`${API_PATH}/admin/input_data`, requestBody);


  if (!response.ok) throw new Error("Failed to upload URLs");
  return response.json();
}

export interface Message {
  user: string;
  message: string
}

export interface ChatResponseType {
  company_name: string;
  qa_history: Message[];
  answer: Message;
}

export async function sendMessage(companyName: string, message: string, username: string): Promise<ChatResponseType> {
  const qaHistory = [
    {
      user: username,
      message: message,
    }
  ]
  const requestBody = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company_name: companyName, qa_history: qaHistory }),
  };
  console.log(requestBody)

  const response = await fetch(`${API_PATH}/user/chat`, requestBody);

  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
}
