import React, { useState } from "react";
import "../CSS/ChatLoggedIn.css";

function ChatLoggedIn() {
  const [messages, setMessages] = useState([
    { type: "received", content: "Hello! How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "sent", content: inputValue },
    ]);
    setInputValue("");
  };

  return (
    <div className="app">
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
    </div>
  );
}

export default ChatLoggedIn;
