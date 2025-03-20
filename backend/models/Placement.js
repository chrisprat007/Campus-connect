import mongoose from "mongoose";
const PlacementSchema = new mongoose.Schema({
  features: { type: Object },
  salary: { type: Number }
}, { timestamps: true });
export default mongoose.model("Placement", PlacementSchema);
