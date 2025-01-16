// routes/city.js
import express from "express";
import City from "../models/City.js";

const router = express.Router();

// Create a new city
router.post("/add", async (req, res) => {
    const { name, state } = req.body;
    try {
        const city = await City.create({ name, state });
        res.status(201).json({ message: "City created successfully", city });
    } catch (error) {
        res.status(500).json({ error: "Failed to create city" });
    }
});

export default router;
