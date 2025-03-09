"use client";

import { useState } from "react";
import { sendMessage } from "@/lib/api";

export default function User() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  return (
    <div className="flex flex-col items-center p-10 bg-white shadow-lg rounded-lg w-full max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Chat with System</h1>

      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-3 w-full rounded-lg"
      />
      <button onClick={() => sendMessage(message)} className="mt-2">Send</button>

      {response && <p className="mt-4 p-2 border bg-gray-100 w-full rounded">{response}</p>}
    </div>
  );
}
