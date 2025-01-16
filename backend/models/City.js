import mongoose from "mongoose";

const CitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
});

export default mongoose.model("City", CitySchema);
