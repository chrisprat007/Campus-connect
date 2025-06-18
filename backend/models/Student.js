import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tech: { type: String, default: "" },
  status: { type: String, enum: ["Completed", "In Progress"], default: "In Progress" },
});

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, default: "" },
  date: { type: String, default: "" }, // e.g., year or full date
});

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: String, default: "" },
});

const InternshipSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, default: "" },
  duration: { type: String, default: "" },
  year: { type: String, default: "" },
});

const FeatureSchema = new mongoose.Schema({
  technicalSkills: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  leadership: { type: Number, default: 0 },
  problemSolving: { type: Number, default: 0 },
}, { _id: false });

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true },
    cgpa: { type: Number, default: 0 },
    projects: {
      type: [ProjectSchema],
      default: [],
    },
    certifications: {
      type: [CertificationSchema],
      default: [],
    },
    achievements: {
      type: [AchievementSchema],
      default: [],
    },
    internships: {
      type: [InternshipSchema],
      default: [],
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    features: { type: FeatureSchema, default: () => ({}) },
    predictedSalary: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Student", StudentSchema);
