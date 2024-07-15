import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

function Chat() {
  const [messages, setMessages] = useState([
    { sender: "user", text: "who are you" },
    { sender: "sys", text: "I am AI" }
  ]);
  const [input, setInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (authToken) {
      setIsLoggedIn(true);
      fetchMessages();
    } else {
      setIsLoggedIn(false);
    }
  }, [authToken]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: "user" };
      setMessages([...messages, newMessage]);
      setInput("");

      try {
        // Send the user message to your backend or directly to the LLM server
        const response = await fetch("http://localhost:5000/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ query: input }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        const botMessage = { text: data.response, sender: "sys" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <div className="flex flex-1">
        {isLoggedIn ? (
          <div className="w-1/4 bg-gray-100 p-4">
            <h2 className="text-lg font-semibold mb-4">Chat History</h2>
            <div className="overflow-y-auto h-full">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.sender === "user"
                      ? "text-right text-blue-500"
                      : "text-left text-green-500"
                  } mb-2`}
                >
                  <span className="inline-block p-2 bg-white rounded-lg shadow-sm">
                    {message.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-1/4 bg-gray-100 p-4 flex items-center justify-center">
            <div className="text-center">
              <p className="mb-4">
                Please{" "}
                <button
                  onClick={handleLoginRedirect}
                  className="text-blue-500 underline focus:outline-none hover:text-blue-600"
                >
                  login
                </button>{" "}
                to save your conversation history.
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 bg-white p-4">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.sender === "user"
                      ? "self-end text-right text-blue-500"
                      : "self-start text-left text-green-500"
                  } mb-2`}
                >
                  <span className="inline-block p-2 bg-gray-200 rounded-lg shadow-sm">
                    {message.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex mt-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white py-2 px-4 ml-2 rounded hover:bg-blue-600 transition duration-300 focus:outline-none"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Chat;
