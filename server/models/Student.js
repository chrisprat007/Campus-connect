import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const projectSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  tech:        [String],
  github:      { type: String },
})

const certificationSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  issuer:     { type: String },
  date:       { type: String },
  credential: { type: String },
})

const internshipSchema = new mongoose.Schema({
  company:     { type: String, required: true },
  role:        { type: String },
  duration:    { type: String },
  description: { type: String },
  location:    { type: String },
  stipend:     { type: String },
})

const achievementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  category:    { type: String },
  description: { type: String },
  date:        { type: String },
})

const studentSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true, lowercase: true },
    password:   { type: String, required: true, select: false },
    phone:      { type: String },
    cgpa:       { type: Number, default: 0 },
    batch:      { type: String },
    domain:     { type: String },
    department: { type: String },
    resumeUrl:  { type: String },
    avatar:     { type: String },

    projects:       [projectSchema],
    certifications: [certificationSchema],
    internships:    [internshipSchema],
    achievements:   [achievementSchema],
  },
  { timestamps: true }
)

// Hash password before save
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

studentSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

export default mongoose.model('Student', studentSchema)
