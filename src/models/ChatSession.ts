import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "New Career Conversation",
  },
  messages: [
    {
      role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ChatSession = mongoose.models.ChatSession || mongoose.model("ChatSession", chatSessionSchema);