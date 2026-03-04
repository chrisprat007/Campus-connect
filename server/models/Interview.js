import mongoose from 'mongoose'

const interviewSchema = new mongoose.Schema(
  {
    company:    { type: String, required: true },
    position:   { type: String, required: true },
    type:       { type: String, enum: ['On-Campus', 'Off-Campus', 'Referral', 'Walk-in'], default: 'On-Campus' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    result:     { type: String, enum: ['Selected', 'Rejected', 'On Hold'], default: 'Selected' },
    location:   { type: String },
    salary:     { type: String },
    tags:       [String],
    content:    { type: String },
    author:     { type: String },                                         // display name snapshot
    student:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // null if admin posted
    postedBy:   { type: String, enum: ['student', 'admin'], default: 'student' },
  },
  { timestamps: true }
)

export default mongoose.model('Interview', interviewSchema)
