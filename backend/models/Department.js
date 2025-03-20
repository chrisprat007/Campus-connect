import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        enum: [
            "CSE", "IT", "ECE", "EEE", "ME", "CE", "CHE", "BME",
            "AE", "AUTO", "BT", "IE", "MNE", "MT", "RA", "DSAI"
        ] 
    },
    role: { type: String, required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    secretKey: { type: String, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tasks", required: true }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }] // Added students array
});

export default mongoose.model("Department", DepartmentSchema);
