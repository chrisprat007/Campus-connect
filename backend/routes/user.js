import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// Get all posts from all departments
router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find().populate("department", "name role");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

export default router;
