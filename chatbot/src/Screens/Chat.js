import React, { useState } from "react";
import { Link } from "react-router-dom";

function Chat({ isAuthenticated }) {
  const [messages, setMessages] = useState([
    { type: "received", content: "Hello! How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "sent", content: inputValue },
    ]);

    const query = inputValue;
    setInputValue("");

    try {
      const response = await fetch("http://localhost:5000/api/something", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "received", content: data.answer },
      ]);
    } catch (error) {
      console.error("Error fetching RAG response:", error);
    }
  };

  return (
    <div className="app">
      {isAuthenticated ? (
        <>
          <aside className="sidebar">
            <button className="new-chat">+ New chat</button>
            <div className="chat-list">
              <div className="chat-item">Creating HTML Links</div>
              <div className="chat-item">New chat</div>
              <div className="chat-item">New chat</div>
              <div className="chat-item">New chat</div>
              <div className="chat-item">New chat</div>
              <div className="chat-item">New chat</div>
              <div className="chat-item">New chat</div>
            </div>
            <div className="sidebar-footer">
              <button>Clear conversations</button>
              <button>Light mode</button>
              <button>OpenAI Discord</button>
              <button>Updates & FAQ</button>
              <button>Log out</button>
            </div>
          </aside>
          <main className="chat-area">
            <div className="chat-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.type === "sent" ? "sent" : "received"
                  }`}
                >
                  {message.type === "received" && (
                    <div className="avatar">
                      <img src="profile-placeholder.png" alt="User" />
                    </div>
                  )}
                  <div className="text">{message.content}</div>
                </div>
              ))}
              <footer className="chat-footer">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="send-button" onClick={handleSend}>
                  Send
                </button>
              </footer>
            </div>
          </main>
        </>
      ) : (
        <div className="chat">
          <div className="chat-container">
            <div className="chat-page">
              <header className="chat-header">
                <div className="header-left">
                  <div className="dropdown">
                    <select>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>
                </div>
                <div className="header-right">
                  <Link to="/login" className="login-button">
                    Login
                  </Link>
                  <Link to="/signup" className="signup-button">
                    Signup
                  </Link>
                </div>
              </header>
              <div className="chat-area">
                <div className="message received">
                  <div className="avatar">
                    <img src="profile-placeholder.png" alt="User" />
                  </div>
                  <div className="text">Hello! How can I help you today?</div>
                </div>
              </div>
              <footer className="chat-footer">
                <input type="text" placeholder="Type a message..." />
                <button className="send-button">Send</button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
