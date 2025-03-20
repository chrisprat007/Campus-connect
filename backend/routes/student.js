import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import Student from "../models/Student.js";
import Department from "../models/Department.js";
import mongoose from "mongoose";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to parse fields from the Excel file.
// If the field appears as a JSON-like string, try to parse it; otherwise, split by comma.
function parseField(field, defaultFn) {
  if (!field) return [];
  const trimmed = field.toString().trim();
  if (trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed.replace(/'/g, '"'));
    } catch (err) {
      return trimmed.split(",").map(defaultFn);
    }
  } else {
    return trimmed.split(",").map(defaultFn);
  }
}

// POST route to upload and process the Excel file.
router.post(
  "/upload/:departmentId",
  upload.single("file"),
  async (req, res) => {
    try {
      const { departmentId } = req.params;
      const departmentDoc = await Department.findById(departmentId);
      if (!departmentDoc) {
        return res.status(404).json({ error: "Department not found" });
      }
      const collegeId = departmentDoc.college;
      const fileBuffer = req.file.buffer;
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Map each row to a student object.
      const students = jsonData.map((student) => ({
        name: student["Name"],
        email: student["Email"],
        rollNumber: student["RollNumber"],
        cgpa: student["CGPA"],
        projects: parseField(student["Projects"], (p) => ({
          title: p.trim(),
          description: "",
          link: "",
        })),
        certifications: parseField(student["Certifications"], (c) => ({
          name: c.trim(),
          issuedBy: "",
          year: null,
        })),
        achievements: parseField(student["Achievements"], (a) => ({
          title: a.trim(),
          description: "",
        })),
        internships: parseField(student["Internships"], (i) => ({
          company: i.trim(),
          role: "",
          duration: "",
          description: "",
        })),
        // Force the department to always be the current one.
        department: departmentId,
        college: collegeId,
      }));

      const newRollNumbers = students.map((s) => s.rollNumber);
      const existingStudents = await Student.find(
        { rollNumber: { $in: newRollNumbers } },
        "rollNumber"
      );
      const existingRollNumbers = new Set(
        existingStudents.map((s) => s.rollNumber)
      );
      const uniqueStudents = students.filter(
        (s) => !existingRollNumbers.has(s.rollNumber)
      );

      console.log(uniqueStudents);
      await Student.insertMany(uniqueStudents);
      res.status(201).json({
        message: "Students uploaded successfully",
        insertedCount: uniqueStudents.length,
        students: uniqueStudents,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({ error: "Failed to process student data" });
    }
  }
);

// GET route to fetch student data for a given department.
router.get("/:departmentId", async (req, res) => {
  try {
    const { departmentId } = req.params;
    const students = await Student.find({ department: departmentId });

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


router.get("/salary/:departmentId?", async (req, res) => {
  try {
    let { departmentId } = req.params;
    let { min, max } = req.query;

    if (!min || !max) {
      return res.status(400).json({ error: "Salary range (min and max) required" });
    }

    min = Number(min);
    max = Number(max);

    if (isNaN(min) || isNaN(max)) {
      return res.status(400).json({ error: "Invalid salary range values" });
    }

    // Build the query
    const query = { predictedSalary: { $gte: min, $lt: max } };

    // Check if departmentId is a valid ObjectId
    if (departmentId && departmentId!="xyz" && mongoose.Types.ObjectId.isValid(departmentId)) {
      query.department = new mongoose.Types.ObjectId(departmentId);
    } else {
      departmentId = null; 
    }

    console.log("Query:", query); // Debugging
    const students = await Student.find(query);

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students by salary:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


export default router;
