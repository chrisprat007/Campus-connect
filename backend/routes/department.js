import express from "express";
import Department from "../models/Department.js";
import Post from "../models/Post.js";

const router = express.Router();

// Add a new post by a department
router.post("/add-post", async (req, res) => {
    const { departmentId, title, content } = req.body;
    try {
        const post = await Post.create({ title, content, department: departmentId });
        await Department.findByIdAndUpdate(departmentId, { $push: { posts: post._id } });
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        res.status(500).json({ error: "Failed to create post" });
    }
});

// Get all posts of a specific department
router.get("/posts/:departmentId", async (req, res) => {
    const { departmentId } = req.params;
    try {
        const posts = await Post.find({ department: departmentId });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// Add a new department to a city
router.post("/add", async (req, res) => {
    const { name, role, cityId } = req.body;
    try {
        const department = await Department.create({ name, role, city: cityId });
        res.status(201).json({ message: "Department added successfully", department });
    } catch (error) {
        res.status(500).json({ error: "Failed to add department" });
    }
});

export default router;
