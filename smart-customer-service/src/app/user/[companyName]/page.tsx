"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Message, sendMessage } from "@/lib/api";

export default function User() {
  const { companyName } = useParams();
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [qaHistory, setQAHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Add initial greeting
  useEffect(() => {
    const initialMessage = {
      user: companyName as string,
      message: `Hi! I'm ${companyName}'s smart assistant. How can I help you today?`,
      timestamp: new Date().toISOString()
    };
    setQAHistory([initialMessage]);
  }, [companyName]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [qaHistory]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) {
      setFeedback("Please enter a message before sending");
      return;
    }

    try {
      setIsLoading(true);
      setFeedback("");

      // Add user message
      const userMessage = {
        user: "User",
        message,
        timestamp: new Date().toISOString()
      };
      setQAHistory(prev => [...prev, userMessage]);

      // Send to API
      const result = await sendMessage(companyName as string, message, "User");

      // Add bot response
      const botMessage = {
        user: companyName as string,
        message: result.answer.message,
        timestamp: new Date().toISOString()
      };
      setQAHistory(prev => [...prev, botMessage]);

      setMessage("");
    } catch (error) {
      console.error(error);
      setFeedback("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            {companyName} Assistant
          </h1>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {qaHistory.map((item, index) => (
            <div
              key={index}
              className={`flex ${item.user === "User" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-lg ${
                  item.user === "User"
                    ? "bg-blue-500 text-white"
                    : "bg-white shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">
                    {item.user === "User" ? "You" : item.user}
                  </span>

                </div>
                <p className="whitespace-pre-wrap">{item.message}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="bg-white p-4 shadow-lg">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto"
        >
          <div className="flex space-x-4">
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setFeedback("");
              }}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(e)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
          
          {feedback && (
            <div className="mt-2 text-sm text-red-600">{feedback}</div>
          )}
        </form>
      </div>
    </div>
  );
}