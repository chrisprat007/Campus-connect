import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import Placement from "../models/Placement.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const departmentId = req.body.departmentId;
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    console.log(rows);

    if (!rows.length) return res.status(400).json({ error: "Empty Excel file" });

    const placements = rows.map((row) => ({
      name: row.Name,
      company: row.Company,
      department: departmentId,
      salary: parseFloat(row.Salary), // Ensure the field is a number and stored as "salary"
      year: row.Year,
      features: {
        cgpa: row.CGPA,
        projects: row.Projects,
        internships: row.Internships,
      },
    }));

    await Placement.insertMany(placements);

    res.status(200).json({ message: "Placement data uploaded successfully" });

    setTimeout(() => {
      fetch(`http://localhost:8000/train/${departmentId}`)
        .then((res) => res.json())
        .then((data) => console.log("Training Response:", data))
        .catch(console.error);
    }, 1000);
    
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
});

export default router;
