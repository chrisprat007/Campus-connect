import express from 'express';
import multer from 'multer';
import Post from '../models/Post.js';

const router = express.Router();

// Configure multer to handle image uploads
const storage = multer.memoryStorage();  
const upload = multer({ storage: storage });

// Route to create a post with an image upload
router.post("/add", upload.single('image'), async (req, res) => {
   
    const { title, description, departmentId } = req.body;
    console.log(title);
    const imageBuffer = req.file ? req.file.buffer : null;  

    try {
        const post = await Post.create({
            title,
            description,
            images: imageBuffer,  // Store the image data as Buffer
            department: departmentId,
        });

        res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to create post" });
    }
});


router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("department", "name role");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

export default router;
