import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import departmentRoutes from "./routes/department.js";
import userRoutes from "./routes/user.js";
import cityRoutes from "./routes/city.js";
import postRoutes from "./routes/post.js";
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/city_cooperation", {
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed", err));

app.use("/departments", departmentRoutes);
app.use("/users", userRoutes);
app.use("/city", cityRoutes); 
app.use("/post",postRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
