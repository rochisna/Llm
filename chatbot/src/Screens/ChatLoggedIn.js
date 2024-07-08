import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/ChatLoggedIn.css";

export default function ChatLoggedIn() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="chat">
      <div className={`chat-container ${sidebarOpen ? "sidebar-open" : ""}`}>
        <aside className="sidebar">
          <div className="profile-icon" onClick={toggleSidebar}>
            <img src="profile-placeholder.png" alt="Profile" />
          </div>
          {sidebarOpen && (
            <div className="profile-section">
              <button className="new-chat-button">+ New Chat</button>
              <div className="chat-section">
                <h4>Today</h4>
                <div className="chat-item">Chat 1</div>
                <div className="chat-item">Chat 2</div>
              </div>
              <div className="chat-section">
                <h4>Yesterday</h4>
                <div className="chat-item">Chat 1</div>
                <div className="chat-item">Chat 2</div>
              </div>
              <div className="bottom-options">
                <button className="logout-button">Logout</button>
                <button className="settings-button">Settings</button>
              </div>
            </div>
          )}
        </aside>
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
              <Link to="/" className="back-to-home-button">
                Back to Home
              </Link>
            </div>
            <button className="share-button">Share</button>
          </header>
          <div className="chat-area">
            {/* Placeholder for messages, replace with dynamic rendering */}
            <div className="message received">
              <div className="avatar">
                <img src="profile-placeholder.png" alt="User" />
              </div>
              <div className="text">Hello! How can I help you today?</div>
            </div>
            {/* Add more messages as needed */}
          </div>
          <footer className="chat-footer">
            <input type="text" placeholder="Type a message..." />
            <button className="send-button">Send</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
