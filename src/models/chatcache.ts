import mongoose from "mongoose";

const chatCacheSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true, // This speeds up searches and prevents duplicates
  },
  answer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// This line prevents Next.js from throwing errors when you save the file
export const ChatCache = mongoose.models.ChatCache || mongoose.model("ChatCache", chatCacheSchema);