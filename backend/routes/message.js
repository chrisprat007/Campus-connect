import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// GET messages between two parties (e.g. City and Department)
router.get("/", async (req, res) => {
  const { sender, senderModel, receiver, receiverModel } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender, senderModel, receiver, receiverModel },
        { sender: receiver, senderModel: receiverModel, receiver: sender, receiverModel: senderModel },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
