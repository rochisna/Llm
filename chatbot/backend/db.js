const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://Chatbot:Rack2004@cluster0.qi2t4mj.mongodb.net/Chatbot?retryWrites=true&w=majority&appName=Cluster0";

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

module.exports = mongoDB;
