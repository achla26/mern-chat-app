import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Optional: Link to the related resource (e.g., a chat or post)
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export const Notification = mongoose.model("Notification", notificationSchema);