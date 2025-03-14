import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        enum: ["Municipal Corporation", "Traffic Police", "Public Works", "Water Supply"] 
    },
    role: { type: String, required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
    secretKey: { type: String, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tasks", required: true }],
});

export default mongoose.model("Department", DepartmentSchema);
