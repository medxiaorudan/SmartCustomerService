"use client";

import { useState} from "react";
import { useParams } from "next/navigation";  // Correct hook to use in App Router
import { Message, sendMessage } from "@/lib/api";

export default function User() {
  const { companyName } = useParams();  // Use useParams to get dynamic parameter
  const [username, setUsername] = useState("defaultName");
  const [message, setMessage] = useState("");
  const [feedbackBoxMessage, setFeedbackBoxMessage] = useState("")
  const [qaHistory, setQAHistory] = useState<Message[]>([]);

  // Add a new message to the history
  const addMessage = (message: Message) => {    
    setQAHistory((prevHistory) => [...prevHistory, message]);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      // Optionally, handle empty message scenario
      setFeedbackBoxMessage("Please enter a message.");
      return;
    }

    try {
      addMessage({ user: username, message: message });  // Assuming sendMessage returns a response
      const result = await sendMessage(companyName as string, message, username);  // Send message to backend with companyName
      addMessage({ user: companyName as string, message: result.answer.message});  // Assuming sendMessage returns a response
      setFeedbackBoxMessage("");
    } catch (error) { 
      console.error(error);
      setFeedbackBoxMessage("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center p-10 bg-white shadow-lg rounded-lg w-full max-w-lg">
      <div>
        <h2 className="text-3xl font-bold mb-4">Name</h2>

        <input
          type="text"
          placeholder="Type your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 w-full rounded-lg"
        />
      </div>


      <h1 className="text-3xl font-bold mb-4">Chat with System - {companyName}</h1>

      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-3 w-full rounded-lg"
      />
      <button
        onClick={handleSendMessage}  // Call handleSendMessage on button click
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
      <ul className="w-full space-y-4">
        {qaHistory.map((item, index) => (
          <li
            key={index}
            className="p-4 bg-white rounded-lg shadow-md flex flex-col space-y-2"
          >
            <div className="text-lg font-semibold text-blue-500">{item.user}</div>
            <div className="text-gray-700">{item.message}</div>
          </li>
        ))}
      </ul>

      {feedbackBoxMessage && <p className="mt-4 p-2 border bg-gray-100 w-full rounded">{feedbackBoxMessage}</p>}
    </div>
  );
}
