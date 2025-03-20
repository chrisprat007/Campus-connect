import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Analytics({ departmentId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/${departmentId}`);
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (range) => {
    setSelectedRange(range);
    setCurrentPage(1); // Reset to first page when fetching new data
    try {
      const res = await api.get(`/students/salary/${departmentId}`, {
        params: { min: range[0], max: range[1] },
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [departmentId]);

  if (loading || !analytics) {
    return <p>Loading analytics...</p>;
  }

  const ranges = [
    { label: "Below 5 LPA", key: "below5", color: "#E74C3C", range: [0, 5] },
    { label: "Above 5 LPA", key: "above5", color: "#F39C12", range: [5, 10] },
    { label: "Above 10 LPA", key: "above10", color: "#27AE60", range: [10, 20] },
    { label: "Above 20 LPA", key: "above20", color: "#2980B9", range: [20, 100] },
  ];

  const maxValue = 100;

  // Pagination logic
  const totalPages = Math.ceil(students.length / recordsPerPage);
  const paginatedStudents = students.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  return (
    <div>
      <div className="flex justify-center items-center gap-20">
        {ranges.map((range) => (
          <div
            key={range.key}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => fetchStudents(range.range)}
          >
            <div style={{ width: 120, height: 120 }}>
              <CircularProgressbar
                value={(analytics[range.key] / maxValue) * 100}
                text={`${analytics[range.key]}%`}
                styles={buildStyles({
                  textSize: "20px",
                  pathColor: range.color,
                  textColor: "#333",
                  trailColor: "#eee",
                })}
              />
            </div>
            <p className="mt-3 text-lg font-semibold" style={{ color: range.color }}>
              {range.label}
            </p>
          </div>
        ))}
      </div>

      {selectedRange && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">
            Students in range: {selectedRange[0]} - {selectedRange[1]} LPA
          </h2>
          {paginatedStudents.length > 0 ? (
            <>
              <table className="w-full border-collapse border border-gray-200 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Predicted Salary (LPA)</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => (
                    <tr key={student._id} className="text-center">
                      <td className="border border-gray-300 p-2">{student.name}</td>
                      <td className="border border-gray-300 p-2">{student.email}</td>
                      <td className="border border-gray-300 p-2">{parseFloat(student.predictedSalary).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="flex justify-center mt-4">
                <button
                  className={`px-4 py-2 mx-2 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2">{currentPage} / {totalPages}</span>
                <button
                  className={`px-4 py-2 mx-2 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 mt-4">No students found in this salary range.</p>
          )}
        </div>
      )}
    </div>
  );
}
