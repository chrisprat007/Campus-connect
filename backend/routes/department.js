import express from "express";
import Department from "../models/Department.js";
import Post from "../models/Post.js";

const router = express.Router();

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
