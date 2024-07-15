const Conversation = require("../models/Conversation");

// Get all conversations
const AllConversations  = async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new conversation
const NewConversation  = async (req, res) => {
  const { messages, participants } = req.body;
  const newConversation = new Conversation({
    messages,
    participants,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {AllConversations, NewConversation};
