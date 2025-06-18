import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import Message from "./models/Message.js";
import departmentRoutes from "./routes/department.js";
import collegeRoutes from "./routes/college.js";
import messageRoutes from "./routes/message.js";
import tasksRoutes from "./routes/tasks.js";
import studentRoutes from "./routes/student.js";
import analyticsRouter from "./routes/analytics.js";
import trainRouter from "./routes/train.js";
import placementRouter from "./routes/placement.js";
import meetingRouter from "./routes/meeting.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const server = http.createServer(app);
const PORT = 8000;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/college_cooperation", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed", err));

// Routes
app.use("/departments", departmentRoutes);
app.use("/city", collegeRoutes);
app.use("/message", messageRoutes);
app.use("/tasks", tasksRoutes);
app.use("/students", studentRoutes);
app.use("/analytics", analyticsRouter);
app.use("/train", trainRouter);
app.use("/placements", placementRouter);
app.use("/meetings", meetingRouter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ 
      url: fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});
app.use('/uploads', express.static('uploads'));


// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userRooms = {};


io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    userRooms[socket.id] = userId;
    console.log(`User ${userId} joined chat room`);
  });

  socket.on("leaveRoom", (userId) => {
    socket.leave(userId);
    delete userRooms[socket.id];
    console.log(`User ${userId} left chat room`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      // Ensure at least one of message or file exists
      if (!data.message && !data.file) {
        throw new Error("Message must contain either text or file");
      }
  
      const newMessage = new Message({
        sender: data.sender,
        senderModel: data.senderModel,
        receiver: data.receiver,
        receiverModel: data.receiverModel,
        message: data.message || "", // Default to empty string if not provided
        file: data.file || undefined, // Only include if exists
        timestamp: data.timestamp || new Date(),
      });
  
      await newMessage.save();
      io.to(data.receiver).emit("receiveMessage", newMessage);
      console.log(`Message sent from ${data.sender} to ${data.receiver}`,newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      // Optionally emit an error back to the sender
      socket.emit("messageError", { error: error.message });
    }
  });

  socket.on("disconnect", () => {
    const room = userRooms[socket.id];
    if (room) socket.leave(room);
    delete userRooms[socket.id];
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.io available on ws://localhost:${PORT}`);
});
