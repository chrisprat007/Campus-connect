import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
});

export default mongoose.model("College", CollegeSchema);
