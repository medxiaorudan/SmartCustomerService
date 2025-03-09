const API_PATH = 'http://localhost:8000';

export async function uploadUrls(password, companyName: string, urls: string[]) {

  const requestBody = {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": password },
    body: JSON.stringify({ company_name: companyName, urls:urls }),
  };
  console.log(requestBody)

  const response = await fetch(`${API_PATH}/admin/input_data`, requestBody);


  if (!response.ok) throw new Error("Failed to upload URLs");
  return response.json();
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://your-backend.com/api/upload-file", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload file");
  return response.json();
}

export async function sendMessage(message: string) {
  const response = await fetch("https://your-backend.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
}
