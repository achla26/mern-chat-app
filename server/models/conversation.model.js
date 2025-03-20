import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User schema
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Reference the Message model by name
    },
    isGroup: { type: Boolean, default: false },
    groupName: { type: String, default: "" }, // Optional: For group chat names
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
