const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  messages: [messageSchema],
  participants: [String], // Example: User IDs or usernames
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conversation", conversationSchema);
