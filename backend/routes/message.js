import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { sender, receiver } = req.query;

    try {
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).populate("sender", "name").populate("receiver", "name");

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

export default router;
