import express from "express";
import College from "../models/College.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existingCollege = await College.findOne({ email });
    if (existingCollege)
      return res.status(400).json({ message: "College admin already exists" });

    const newCollege = new College({ name, email, password, departments: [] });
    await newCollege.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let existingCollege = await College.findOne({ email });
    if (existingCollege) {
        if(existingCollege.password === password){
            return res.status(200).json({
                id: existingCollege.id,
                name: existingCollege.name,
                message: "Login success",
            });
        } else {
            return res.status(401).json("Invalid password");
        }
    } else {
        return res.status(400).json("Invalid credentials");
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const colleges = await College.find({}, "name");
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch colleges" });
  }
});

export default router;
