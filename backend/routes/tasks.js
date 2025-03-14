import express from 'express';
import Tasks from '../models/Tasks.js';
import Department from '../models/Department.js';
import mongoose from 'mongoose';

const router=express.Router();

router.get("/:departmentId", async (req, res) => {
    try {
      const tasks = await Tasks.find({department:req.params.departmentId});
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tasks" });
    }
  });
  
  router.post("/", async (req, res) => {
    try {
        console.log("Received data:", req.body);

        const { name, description, department, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(department)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }

        // Create and save the task
        const newTask = new Tasks({ name, description, department, status });
        await newTask.save();

        // Update department with the new task ID
        await Department.findByIdAndUpdate(
            department,
            { $push: { tasks: newTask._id } },
            { new: true }
        );

        console.log("Task saved:", newTask);
        res.status(201).json(newTask);

    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
});

  router.put("/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const task = await Tasks.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      task.status = status;
      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error updating task", error: error.message });
    }
  });
  
  
  router.delete("/:id", async (req, res) => {
    try {
      await Tasks.findByIdAndDelete(req.params.id);
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting task" });
    }
  });
  
  export default router;