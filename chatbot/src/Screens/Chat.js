import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNewChatButton, setShowNewChatButton] = useState(false);
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

  useEffect(() => {
    if (messages.length > 0) {
      setShowNewChatButton(true);
    } else {
      setShowNewChatButton(false);
    }
  }, [messages]);

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
      const newMessage = { text: input, sender: "user", timestamp: new Date() };
      setMessages([...messages, newMessage]);

      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(newMessage),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        setMessages([...messages, data]);
        setInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowNewChatButton(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  return (
    <div className="absolute inset-0 flex flex-col min-h-screen">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/4 bg-gray-100 p-4 flex flex-col">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleNewChat}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 focus:outline-none mb-4"
              >
                + New Chat
              </button>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold mb-2">Today</h2>
                <div className="overflow-y-auto h-full mb-4">
                  {messages
                    .filter((message) => isToday(new Date(message.timestamp)))
                    .map((message, index) => (
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
                <h2 className="text-lg font-semibold mb-2">Yesterday</h2>
                <div className="overflow-y-auto h-full">
                  {messages
                    .filter((message) =>
                      isYesterday(new Date(message.timestamp))
                    )
                    .map((message, index) => (
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
              <div className="mt-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 focus:outline-none w-full mb-2"
                >
                  Logout
                </button>
                <button
                  onClick={handleSettings}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300 focus:outline-none w-full"
                >
                  Settings
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-grow">
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
        </div>

        <div className="flex-1 bg-white p-4 flex flex-col overflow-hidden">
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
  );
}

export default Chat;
