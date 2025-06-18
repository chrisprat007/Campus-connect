import express from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";
const router = express.Router();
import Department from "../models/Department.js";
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const objId = new mongoose.Types.ObjectId(id);

    // Check if ID is a Department
    const departmentExists = await Department.exists({ _id: objId });

    let matchCondition = { predictedSalary: { $exists: true } };

    if (departmentExists) {
      matchCondition.department = objId;
    } else {
      // If not a department, treat it as a college ID and match departments under the college
      const departments = await Department.find({ college: objId }, { _id: 1 });
      console.log("Departments found:", departments);
      if (departments.length === 0) {
        return res.status(400).json({ error: "No department or college found with this ID" });
      }

      const deptIds = departments.map(d => d._id);
      matchCondition.department = { $in: deptIds };
    }

    const result = await Student.aggregate([
      { $match: matchCondition },
      { $set: { roundedSalary: { $round: ["$predictedSalary", 0] } } },
      {
        $bucket: {
          groupBy: "$roundedSalary",
          boundaries: [0, 5, 10, 20, 100],
          default: "Other",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    let analytics = { below5: 0, above5: 0, above10: 0, above20: 0 };
    result.forEach(bucket => {
      if (bucket._id === 0) analytics.below5 = bucket.count;
      else if (bucket._id === 5) analytics.above5 = bucket.count;
      else if (bucket._id === 10) analytics.above10 = bucket.count;
      else if (bucket._id === 20) analytics.above20 = bucket.count;
    });

    const total = analytics.below5 + analytics.above5 + analytics.above10 + analytics.above20;

    if (total > 0) {
      analytics.below5 = parseFloat(((analytics.below5 / total) * 100).toFixed(2));
      analytics.above5 = parseFloat(((analytics.above5 / total) * 100).toFixed(2));
      analytics.above10 = parseFloat(((analytics.above10 / total) * 100).toFixed(2));
      analytics.above20 = parseFloat(((analytics.above20 / total) * 100).toFixed(2));
    }
    console.log("Analytics computed:", analytics);

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error computing analytics:", error);
    res.status(500).json({ error: "Failed to compute analytics" });
  }
});


export default router;
