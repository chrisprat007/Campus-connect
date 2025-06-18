import express from 'express';
import Meeting from '../models/Meeting.js';
import Department from '../models/Department.js';
import mongoose from 'mongoose';
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { title, date, time, agenda, collegeId, departments } = req.body;

    if (!title || !date || !time || !agenda || !collegeId || !departments) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMeeting = new Meeting({
      collegeId,
      title,
      date,
      time,
      agenda,
      selectedDepartments: departments,
    });

    await newMeeting.save();
    console.log(newMeeting);
    res.status(201).json({ message: "Meeting created successfully", meeting: newMeeting });
  } catch (err) {
    console.error("Error creating meeting:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get upcoming meetings for a college
router.get('/upcoming/:collegeId', async (req, res) => {
  try {
    const { collegeId } = req.params;

    const allMeetings = await Meeting.find({ collegeId });

    const now = new Date();

    const upcomingMeetings = allMeetings.filter(meeting => {
      const dateOnly = new Date(meeting.date);
      const [hours, minutes] = meeting.time.split(':').map(Number);

      // Set the time part on the date
      dateOnly.setHours(hours, minutes, 0, 0);

      return dateOnly > now;
    });

    res.json(upcomingMeetings);
  } catch (err) {
    console.error("Error fetching upcoming meetings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/upcoming/department/:departmentId/:collegeId', async (req, res) => {
  try {
    const { departmentId, collegeId } = req.params;

    const allMeetings = await Meeting.find({
      collegeId: new mongoose.Types.ObjectId(collegeId),
    });

    const now = new Date();

    const upcomingMeetings = allMeetings.filter(meeting => {
      const dateOnly = new Date(meeting.date);
      const [hours, minutes] = meeting.time.split(':').map(Number);
      dateOnly.setHours(hours, minutes, 0, 0);
      return dateOnly > now && meeting.selectedDepartments.includes(departmentId);
    });

    // 🔍 Get all unique department IDs from the meetings
    const departmentIdsSet = new Set();
    upcomingMeetings.forEach(meeting => {
      meeting.selectedDepartments.forEach(id => departmentIdsSet.add(id));
    });

    const departmentIds = Array.from(departmentIdsSet);

    // 🧠 Get names of all these departments
    const departments = await Department.find({
      _id: { $in: departmentIds },
    });

    const departmentMap = {};
    departments.forEach(dep => {
      departmentMap[dep._id.toString()] = dep.name;
    });

    // 🛠 Replace selectedDepartments with names
    const meetingsWithDeptNames = upcomingMeetings.map(meeting => ({
      ...meeting.toObject(),
      selectedDepartments: meeting.selectedDepartments.map(
        id => departmentMap[id] || "Unknown"
      ),
    }));

    res.json(meetingsWithDeptNames);
  } catch (err) {
    console.error("Error fetching upcoming meetings:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
