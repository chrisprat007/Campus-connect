import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  senderModel: {
    type: String,
    enum: ["College", "Department"],
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiverModel: {
    type: String,
    enum: ["College", "Department"],
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  file: {
    url: String,
    fileName: String,
    fileType: String,
    fileSize: Number
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Message", MessageSchema);

