import 'dotenv/config'
import mongoose  from 'mongoose'
import connectDB from './config/db.js'
import Student   from './models/Student.js'
import Admin     from './models/Admin.js'
import Interview from './models/Interview.js'

await connectDB()

// ── Clear existing data ────────────────────────────────────────────────────
await Student.deleteMany()
await Admin.deleteMany()
await Interview.deleteMany()
console.log('🗑  Cleared existing data')

// ── Admins ─────────────────────────────────────────────────────────────────
const [admin1] = await Admin.create([
  { name: 'Dr. Ramesh Kumar', email: 'admin@university.edu', password: 'admin123', role: 'admin' },
  { name: 'Prof. Anita Singh', email: 'placement@university.edu', password: 'admin123', role: 'admin' },
])
console.log('✅ Admins seeded')

// ── Students ───────────────────────────────────────────────────────────────
const students = await Student.create([
  {
    name: 'Arjun Mehta', email: 'arjun@university.edu', password: 'student123',
    phone: '+91 98765 43210', cgpa: 8.7, batch: '2021-2025',
    domain: 'Full Stack Development', department: 'Computer Science & Engineering',
    resumeUrl: 'https://drive.google.com/resume-arjun', avatar: 'AM',
    projects: [
      { name: 'SmartCart AI', description: 'An intelligent e-commerce recommendation engine using collaborative filtering and NLP.', tech: ['React','Python','FastAPI','Redis','PostgreSQL'], github: 'https://github.com/arjun/smartcart' },
      { name: 'CloudNotes', description: 'Real-time collaborative note-taking app with markdown support and end-to-end encryption.', tech: ['Next.js','TypeScript','Supabase','Tailwind'], github: 'https://github.com/arjun/cloudnotes' },
      { name: 'DevPulse', description: 'Developer productivity dashboard tracking coding streaks and project health metrics.', tech: ['Vue.js','D3.js','Node.js','MongoDB'], github: 'https://github.com/arjun/devpulse' },
    ],
    certifications: [
      { title: 'AWS Solutions Architect – Associate', issuer: 'Amazon Web Services', date: 'Oct 2024', credential: 'https://aws.amazon.com/cert/123' },
      { title: 'Google Data Analytics Professional', issuer: 'Google / Coursera', date: 'Jun 2024', credential: 'https://coursera.org/cert/456' },
      { title: 'Meta React Developer Certificate', issuer: 'Meta / Coursera', date: 'Feb 2024', credential: 'https://coursera.org/cert/789' },
    ],
    internships: [
      { company: 'Razorpay', role: 'SDE Intern', duration: 'May–Aug 2024', description: 'Worked on payment gateway integrations and built a real-time transaction monitoring dashboard.', location: 'Bengaluru', stipend: '₹50,000/mo' },
      { company: 'HashedIn by Deloitte', role: 'Full Stack Intern', duration: 'Dec 2023–Feb 2024', description: 'Developed microservices for HR automation platform. Improved API response times by 35%.', location: 'Remote', stipend: '₹35,000/mo' },
    ],
    achievements: [
      { title: 'Smart India Hackathon 2024 – Winner', category: 'Hackathon', description: 'Led a team of 6 to build an AI-powered crop advisory system. Won ₹1 Lakh prize.', date: 'Aug 2024' },
      { title: 'ACM ICPC Asia Regionals – Rank 47', category: 'Competitive Programming', description: 'Qualified and competed in ACM ICPC Asia Regionals representing the university.', date: 'Nov 2023' },
      { title: 'Best Final Year Project Award', category: 'Academic', description: 'Awarded by the CS department for outstanding final year project on federated learning.', date: 'Apr 2025' },
    ],
  },
  {
    name: 'Priya Sharma', email: 'priya@university.edu', password: 'student123',
    phone: '+91 87654 32109', cgpa: 9.1, batch: '2021-2025',
    domain: 'Machine Learning', department: 'Computer Science & Engineering',
    resumeUrl: 'https://drive.google.com/resume-priya', avatar: 'PS',
    projects: [
      { name: 'SentimentAI', description: 'Real-time sentiment analysis pipeline for social media streams using transformer models.', tech: ['Python','PyTorch','FastAPI','React'], github: 'https://github.com/priya/sentimentai' },
    ],
    certifications: [
      { title: 'Deep Learning Specialization', issuer: 'deeplearning.ai / Coursera', date: 'Aug 2024', credential: 'https://coursera.org/cert/dl1' },
    ],
    internships: [
      { company: 'Microsoft', role: 'ML Research Intern', duration: 'May–Aug 2024', description: 'Worked on NLP models for intelligent document understanding.', location: 'Hyderabad', stipend: '₹60,000/mo' },
    ],
    achievements: [
      { title: 'Google Women Techmakers Scholar 2024', category: 'Academic', description: 'Selected as one of 50 scholars across India for the Google WTM scholarship.', date: 'Mar 2024' },
    ],
  },
  {
    name: 'Rahul Gupta', email: 'rahul@university.edu', password: 'student123',
    phone: '+91 76543 21098', cgpa: 7.8, batch: '2021-2025',
    domain: 'Backend Development', department: 'Electronics & Communication Engineering',
    resumeUrl: 'https://drive.google.com/resume-rahul', avatar: 'RG',
    projects: [
      { name: 'LogiTrack', description: 'Fleet management system with real-time GPS tracking and driver analytics.', tech: ['Node.js','Express','MongoDB','Socket.io'], github: 'https://github.com/rahul/logitrack' },
    ],
    certifications: [],
    internships: [
      { company: 'Swiggy', role: 'Backend Intern', duration: 'Jun–Aug 2024', description: 'Worked on order management microservice handling 10K+ orders/hour.', location: 'Bengaluru', stipend: '₹40,000/mo' },
    ],
    achievements: [],
  },
  {
    name: 'Sneha Patel', email: 'sneha@university.edu', password: 'student123',
    phone: '+91 65432 10987', cgpa: 8.3, batch: '2021-2025',
    domain: 'Mobile Development', department: 'Information Technology',
    resumeUrl: 'https://drive.google.com/resume-sneha', avatar: 'SP',
    projects: [
      { name: 'HealthMate', description: 'Cross-platform health tracking app with AI-powered insights and doctor consultation booking.', tech: ['Flutter','Firebase','Dart','Node.js'], github: 'https://github.com/sneha/healthmate' },
    ],
    certifications: [
      { title: 'Flutter Development Bootcamp', issuer: 'App Brewery / Udemy', date: 'Jan 2024', credential: 'https://udemy.com/cert/flutter' },
    ],
    internships: [
      { company: 'Atlassian', role: 'Mobile Dev Intern', duration: 'Jun–Sep 2024', description: 'Built new features for Jira mobile app improving user engagement by 22%.', location: 'Remote', stipend: '₹45,000/mo' },
    ],
    achievements: [
      { title: 'Runner-up — HackMIT 2024', category: 'Hackathon', description: 'Competed in MIT hackathon and built an accessible learning platform in 24 hours.', date: 'Oct 2024' },
    ],
  },
])
console.log('✅ Students seeded:', students.length)

// ── Interview Experiences ──────────────────────────────────────────────────
await Interview.create([
  {
    company: 'Google', position: 'SDE-1', type: 'On-Campus', difficulty: 'Hard', result: 'Selected',
    location: 'Bengaluru', salary: '₹40 LPA', tags: ['DSA','System Design','Behavioral'],
    content: 'The process had 4 rounds. Round 1 was a DSA screening with 2 medium-hard LeetCode problems. Round 2 focused on system design — I was asked to design YouTube. Rounds 3 & 4 were Googleyness and coding combined. Key tip: practice distributed systems concepts.',
    author: students[0].name, student: students[0]._id, postedBy: 'student',
  },
  {
    company: 'Microsoft', position: 'SDE-1', type: 'On-Campus', difficulty: 'Medium', result: 'Selected',
    location: 'Hyderabad', salary: '₹33 LPA', tags: ['DSA','OOP','HR'],
    content: 'Microsoft had 3 technical rounds + 1 HR. Focus was on OOP design patterns, trees & graphs. They emphasize clean code and communication. The interviewers were very supportive.',
    author: students[1].name, student: students[1]._id, postedBy: 'student',
  },
  {
    company: 'Flipkart', position: 'SDE-1', type: 'Off-Campus', difficulty: 'Medium', result: 'Rejected',
    location: 'Bengaluru', salary: '₹28 LPA', tags: ['DSA','Puzzles','System Design'],
    content: 'Applied via referral. Got 3 coding rounds and 1 system design. System design was about a notification service at scale. I fumbled on database sharding. Practice HLD more thoroughly.',
    author: students[2].name, student: students[2]._id, postedBy: 'student',
  },
  {
    company: 'Atlassian', position: 'Associate SDE', type: 'Off-Campus', difficulty: 'Easy', result: 'Selected',
    location: 'Remote', salary: '₹22 LPA', tags: ['DSA','Values','Cultural Fit'],
    content: 'Super friendly process. Values-based interview with coding. They emphasize teamwork and transparency. Technical rounds were fair — mostly arrays, strings, and one DP problem.',
    author: students[3].name, student: students[3]._id, postedBy: 'student',
  },
])
console.log('✅ Interviews seeded')

console.log('\n🎉 Seed complete!')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('STUDENT LOGINS:')
students.forEach(s => console.log(`  ${s.email}  /  student123`))
console.log('ADMIN LOGINS:')
console.log('  admin@university.edu  /  admin123')
console.log('  placement@university.edu  /  admin123')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
await mongoose.disconnect()
