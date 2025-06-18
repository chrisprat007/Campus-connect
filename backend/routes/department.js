import express from "express";
import Department from "../models/Department.js";
import College from "../models/College.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";
const router = express.Router();

router.post("/add", async (req, res) => {
    const { name, role, college, secretKey, tasks } = req.body;
    try {
        console.log(name, role, college);
        const department = await Department({ name, role, college, posts: [], secretKey, tasks });
        const collegeRecord = await College.findOne({ _id: college });
        collegeRecord.departments.push(department);
        await department.save();
        await collegeRecord.save();

        res.status(201).json({ message: "Department added successfully", department });
    } catch (error) {
        res.status(500).json({ error: "Failed to add department" });
    }
});

router.get("/:collegeId", async (req, res) => {
    try {
        const { collegeId } = req.params;
        const departments = await Department.find({ college: collegeId })
            .populate("college", "name")  
            .populate("tasks", "name description status");

        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch departments" });
    }
});

router.get("/students/:departmentId", async (req, res) => {
  try {
    const { departmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ error: "Invalid departmentId" });
    }
    console.log(req.params);

    const students = await Student.find({ department: departmentId })
      .populate("college", "name")      // optional: populate college name
      .populate("department", "name");  // optional: populate department name

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

router.post("/login", async (req, res) => {
  const { department, college, secretKey } = req.body;

  try {
    const foundCollege = await College.findOne({ name: college });
    if (!foundCollege) {
      return res.status(404).json({ message: "College not found" });
    }

    const foundDepartment = await Department.findOne({
      name: department,
      college: foundCollege._id,
    });

    if (!foundDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    if (foundDepartment.secretKey !== secretKey) {
      return res.status(401).json({ message: "Invalid secret key" });
    }

    res.status(200).json({
      message: "Login successful",
      departmentId: foundDepartment._id,
      departmentName: foundDepartment.name,
      collegeId: foundDepartment.college,
      collegeName: college,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Department login failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const department = await Department.find({}, "name");
    console.log(department);
    res.status(200).json(department);
  } catch (error) {
    console.log("error");
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});

export default router;
