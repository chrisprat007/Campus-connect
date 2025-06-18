// routes/student.js
import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import mongoose from "mongoose";
import Student from "../models/Student.js";
import Department from "../models/Department.js";

const router = express.Router();

// Multer setup for upload
const storage = multer.memoryStorage();
const upload = multer({ storage });
const currentYear = new Date().getFullYear();

// Helper: sanitize a name for email/password generation
function sanitizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "");
}

// Helper: parseField if needed (unused in given code, but kept for reference)
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

// -----------------------------------------------------------------------------
// 1. LOGIN
// POST /api/student/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const student = await Student.findOne({ email, password });
    if (!student) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // You said you store in session. For example:
    // req.session.studentId = student._id;
    // But here we just return a success; frontend should store studentId:
    res.status(200).json({
      message: "Login successful",
      studentId: student._id.toString(),
      // optionally send back name/email for immediate UI
      name: student.name,
      email: student.email,
    });
  } catch (error) {
    console.error("Error during student login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -----------------------------------------------------------------------------
// 2. UPLOAD STUDENTS VIA EXCEL
// POST /api/student/upload/:departmentId
router.post(
  "/upload/:departmentId",
  upload.single("file"),
  async (req, res) => {
    try {
      const { departmentId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        return res.status(400).json({ error: "Invalid departmentId" });
      }
      const departmentDoc = await Department.findById(departmentId);
      if (!departmentDoc) {
        return res.status(404).json({ error: "Department not found" });
      }

      const collegeId = departmentDoc.college;
      const deptCode = departmentDoc.name.replace(/\s+/g, "").toUpperCase();

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileBuffer = req.file.buffer;
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Extract and sort names
      const sortedNames = jsonData
        .map((row) => row["Name"])
        .filter((name) => typeof name === "string" && name.trim())
        .sort((a, b) => a.localeCompare(b));

      // Build student docs
      const studentsToInsert = sortedNames.map((name, index) => {
        const sanitized = sanitizeName(name);
        const serial = String(index + 1).padStart(3, "0");
        const rollNumber = `${currentYear}${deptCode}${serial}`;
        const email = `${sanitized}.${deptCode}${currentYear}@gmail.com`;
        const password = `${sanitized}${rollNumber}`;

        return {
          name: name.trim(),
          password,
          email,
          rollNumber,
          cgpa: 0,
          features: {
            technicalSkills: 0,
            communication: 0,
            leadership: 0,
            problemSolving: 0,
          },
          predictedSalary: 0,
          projects: [],
          certifications: [],
          achievements: [],
          internships: [],
          department: departmentId,
          college: collegeId,
        };
      });

      // Filter out existing rollNumbers or emails in DB
      const rollNumbers = studentsToInsert.map((s) => s.rollNumber);
      const emails = studentsToInsert.map((s) => s.email);
      const existing = await Student.find(
        {
          $or: [
            { rollNumber: { $in: rollNumbers } },
            { email: { $in: emails } },
          ],
        },
        "rollNumber email"
      );
      const existingRolls = new Set(existing.map((d) => d.rollNumber));
      const existingEmails = new Set(existing.map((d) => d.email));

      const uniqueStudents = studentsToInsert.filter(
        (s) => !existingRolls.has(s.rollNumber) && !existingEmails.has(s.email)
      );

      let insertedCount = 0;
      let insertedDocs = [];
      if (uniqueStudents.length > 0) {
        try {
          const docs = await Student.insertMany(uniqueStudents, { ordered: false });
          insertedCount = docs.length;
          insertedDocs = docs;
        } catch (insertErr) {
          // If some duplicates slip through, insertMany with ordered:false will insert the rest.
          if (insertErr.insertedDocs) {
            insertedCount = insertErr.insertedDocs.length;
            insertedDocs = insertErr.insertedDocs;
          }
          // Log but continue
          console.warn("Partial insert errors:", insertErr);
        }
      }

      res.status(201).json({
        message: "Students upload processed",
        requestedCount: studentsToInsert.length,
        filteredOut: studentsToInsert.length - uniqueStudents.length,
        insertedCount,
        students: insertedDocs,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({ error: "Failed to process student data" });
    }
  }
);


// -----------------------------------------------------------------------------
// 3. FETCH STUDENTS BY DEPARTMENT
// GET /api/student/department/:departmentId
router.get("/department/:departmentId", async (req, res) => {
  try {
    const { departmentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ error: "Invalid departmentId" });
    }
    const students = await Student.find({ department: departmentId });
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students by department:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// -----------------------------------------------------------------------------
// 4. FETCH STUDENTS BY SALARY RANGE (department or college)
// GET /api/student/salary/:id?min=...&max=...
router.get("/salary/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { min, max } = req.query;
    if (!min || !max) {
      return res
        .status(400)
        .json({ error: "Salary range (min and max) required" });
    }
    min = Number(min);
    max = Number(max);
    if (isNaN(min) || isNaN(max)) {
      return res.status(400).json({ error: "Invalid salary range values" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const objId = new mongoose.Types.ObjectId(id);
    const departmentExists = await Department.exists({ _id: objId });

    const filter = { predictedSalary: { $gte: min, $lt: max } };
    if (departmentExists) {
      filter.department = objId;
    } else {
      // treat id as collegeId
      const departments = await Department.find({ college: objId }, { _id: 1 });
      if (departments.length === 0) {
        return res
          .status(404)
          .json({ error: "No department or college found with this ID" });
      }
      const deptIds = departments.map((d) => d._id);
      filter.department = { $in: deptIds };
    }
    const students = await Student.find(filter);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students by salary:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// -----------------------------------------------------------------------------
// 5. STUDENT “ME” AND UPDATE ROUTES (studentId from req.body or session)

// Helper to get studentId; if you store in session, replace with req.session.studentId
function getStudentId(req) {
  // If in session: return req.session.studentId;
  return req.body.studentId;
}

// POST /api/student/me
router.get("/:id", async (req, res) => {
  try {
    console.log("entered")
    const studentId = req.params.id;
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid studentId" });
    }
    const student = await Student.findById(studentId)
      .populate("department", "name")
      .populate("college", "name");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error("POST /student/me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/student/updateProfile
router.put("/updateProfile", async (req, res) => {
  try {
    const studentId = getStudentId(req);
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid studentId" });
    }
    const updates = {};
    const allowed = [
      "name",
      "email",
      "rollNumber",
      "department",
      "college",
      "predictedSalary",
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    // Optionally: check uniqueness for email/rollNumber here
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: updates },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Profile updated", student });
  } catch (err) {
    console.error("PUT /student/updateProfile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// PUT /api/student/updateCgpa
router.put("/updateCgpa", async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { cgpa } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (cgpa === undefined || typeof cgpa !== "number") {
      return res.status(400).json({ error: "Invalid cgpa" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid studentId" });
    }
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { cgpa } },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "CGPA updated", cgpa: student.cgpa });
  } catch (err) {
    console.error("PUT /student/updateCgpa error:", err);
    res.status(500).json({ error: "Failed to update CGPA" });
  }
});

// PUT /api/student/updateSkills
router.put("/updateSkills", async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { features } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (!features || typeof features !== "object") {
      return res.status(400).json({ error: "Invalid features" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid studentId" });
    }
    const allowedKeys = [
      "technicalSkills",
      "communication",
      "leadership",
      "problemSolving",
    ];
    const updateObj = {};
    for (const key of allowedKeys) {
      if (features[key] !== undefined) {
        const v = Number(features[key]);
        if (isNaN(v)) {
          return res.status(400).json({ error: `Invalid value for ${key}` });
        }
        updateObj[`features.${key}`] = v;
      }
    }
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: updateObj },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Skills updated", features: student.features });
  } catch (err) {
    console.error("PUT /student/updateSkills error:", err);
    res.status(500).json({ error: "Failed to update skills" });
  }
});

// PUT /api/student/updateProjects
router.put("/updateProjects", async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { projects } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: "Invalid projects array" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid studentId" });
    }
    // Optionally validate each project object fields here
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { projects } },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Projects updated", projects: student.projects });
  } catch (err) {
    console.error("PUT /student/updateProjects error:", err);
    res.status(500).json({ error: "Failed to update projects" });
  }
});

// PUT /api/student/updateCertifications
router.put("/updateCertifications", async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { certifications } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (!Array.isArray(certifications)) {
      return res.status(400).json({ error: "Invalid certifications array" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid studentId" });
    }
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { certifications } },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({
      message: "Certifications updated",
      certifications: student.certifications,
    });
  } catch (err) {
    console.error("PUT /student/updateCertifications error:", err);
    res.status(500).json({ error: "Failed to update certifications" });
  }
});

// PUT /api/student/updateAchievements
router.put("/updateAchievements", async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { achievements } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (!Array.isArray(achievements)) {
      return res.status(400).json({ error: "Invalid achievements array" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid studentId" });
    }
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { achievements } },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({
      message: "Achievements updated",
      achievements: student.achievements,
    });
  } catch (err) {
    console.error("PUT /student/updateAchievements error:", err);
    res.status(500).json({ error: "Failed to update achievements" });
  }
});

// PUT /api/student/updateInternships
router.put("/updateInternships", async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { internships } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    if (!Array.isArray(internships)) {
      return res.status(400).json({ error: "Invalid internships array" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid studentId" });
    }
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { internships } },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({
      message: "Internships updated",
      internships: student.internships,
    });
  } catch (err) {
    console.error("PUT /student/updateInternships error:", err);
    res.status(500).json({ error: "Failed to update internships" });
  }
});

export default router;
