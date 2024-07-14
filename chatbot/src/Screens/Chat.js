import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (authToken) {
      const fetchMessages = async () => {
        const response = await fetch("/api/messages", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setMessages(data);
      };

      fetchMessages();
    }
  }, [authToken]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: "user" };
      setMessages([...messages, newMessage]);

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newMessage),
      });

      const data = await response.json();
      setMessages([...messages, newMessage, data]);
      setInput("");
    }
  };

  if (!authToken) {
    return (
      <div className="flex flex-col min-h-screen">
        <LandingNavbar />
        <div className="flex-1 flex flex-col items-center justify-center bg-neutral-light p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Welcome to AgriLLM
            </h2>
            <p className="text-xl text-neutral mb-8">
              Please log in or sign up to access the chat.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-secondary text-white py-2 px-4 rounded hover:bg-secondary-dark transition duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-light p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 overflow-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.sender === "user"
                    ? "text-right text-primary"
                    : "text-left text-secondary"
                }`}
              >
                <span
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-secondary text-white"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border border-neutral rounded focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Chat;
