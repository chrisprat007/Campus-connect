import mongoose from "mongoose";
const meetingSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'College',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  agenda: {
    type: String,
    required: true
  },
  selectedDepartments: [{
    type: String,  
    required: true
  }]
}, { timestamps: true });

export default mongoose.model("Meeting", meetingSchema);
