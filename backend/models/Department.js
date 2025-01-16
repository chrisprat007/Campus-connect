import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ["Municipal Corporation", "Traffic Police", "Public Works", "Water Supply"] 
    },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

export default mongoose.model("Department", DepartmentSchema);
