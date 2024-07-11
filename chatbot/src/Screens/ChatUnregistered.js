import React from "react";
import { Link } from "react-router-dom";

export default function ChatUnregistered() {
  return (
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
