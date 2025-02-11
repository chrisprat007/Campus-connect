import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import departmentRoutes from "./routes/department.js";
import userRoutes from "./routes/user.js";
import cityRoutes from "./routes/city.js";
import postRoutes from "./routes/post.js";
import messageRoutes from "./routes/message.js";
import Message from "./models/Message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 8000;
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/city_cooperation")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed", err));

app.use("/departments", departmentRoutes);
app.use("/users", userRoutes);
app.use("/city", cityRoutes);
app.use("/post", postRoutes);
app.use("/message",messageRoutes);



let userSockets = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (e) => {
    const { sender, receiver, message } = e;

    try {
      // Create a new message in the database
      const newMessage = new Message({
        sender: sender,
        receiver: receiver,
        message: message,
      });

      await newMessage.save();

      // Emit the message only to the receiver
      io.to(receiver).emit("receiveMessage", newMessage);
      
      console.log("Message saved and emitted to receiver:", newMessage);
    } catch (error) {
      console.error("Failed to save or emit message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
