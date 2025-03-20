import mongoose from "mongoose";
const StudentSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  rollNumber: { type: String },
  cgpa: { type: Number },
  projects: { type: Array },
  certifications: { type: Array },
  achievements: { type: Array },
  internships: { type: Array },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  features: { type: Object },
  predictedSalary: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model("Student", StudentSchema);
