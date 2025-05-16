const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://rochisna:Test123@cluster0.cpw5i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI); // ✅ Removed deprecated options
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
  }
};

// Event listeners for better error handling
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

module.exports = mongoDB;
