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
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 8000;
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/college_cooperation", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed", err));

app.use("/departments", departmentRoutes);
app.use("/city", collegeRoutes);
app.use("/message", messageRoutes);
app.use("/tasks", tasksRoutes);
app.use("/students", studentRoutes);
app.use("/analytics", analyticsRouter);
app.use("/train", trainRouter);
app.use("/placements",placementRouter);
let userRooms = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    userRooms[socket.id] = userId;
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });

  socket.on("leaveRoom", (userId) => {
    socket.leave(userId);
    console.log(`Socket ${socket.id} left room ${userId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new Message(data);
      await newMessage.save();
      io.to(data.receiver).emit("receiveMessage", newMessage);
      console.log(
        `Message from ${data.sender} (${data.senderModel}) to ${data.receiver} (${data.receiverModel}): ${data.message}`
      );
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    const room = userRooms[socket.id];
    if (room) socket.leave(room);
    delete userRooms[socket.id];
    console.log(`Socket ${socket.id} disconnected`);
  });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
