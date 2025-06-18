import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Analytics({ id }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState([20, 100]);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const ranges = [
    { label: "Below 5 LPA", key: "below5", color: "#E74C3C", range: [0, 5] },
    { label: "5-10 LPA", key: "above5", color: "#F39C12", range: [5, 10] },
    { label: "10-20 LPA", key: "above10", color: "#27AE60", range: [10, 20] },
    { label: "20+ LPA", key: "above20", color: "#2980B9", range: [20, 100] },
  ];
  const maxValue = 100;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/analytics/${id}`)
      .then((res) => setAnalytics(res.data))
      .finally(() => setLoading(false));
    fetchStudents(selectedRange, 1);
  }, [id]);

  const fetchStudents = (range, p) => {
    setSelectedRange(range);
    setPage(p);
    api
      .get(`/students/salary/${id}`, {
        params: { min: range[0], max: range[1] },
      })
      .then((res) => setStudents(res.data));
  };

  if (loading || !analytics)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );

  const totalPages = Math.ceil(students.length / perPage);
  const shown = students.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ranges.map((r) => (
          <div
            key={r.key}
            className={`p-4 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition ${
              selectedRange[0] === r.range[0] && selectedRange[1] === r.range[1]
                ? "ring-4 ring-indigo-300"
                : ""
            }`}
            onClick={() => fetchStudents(r.range, 1)}
          >
            <div className="flex justify-center">
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar
                  value={(analytics[r.key] / maxValue) * 100}
                  text={`${analytics[r.key]}%`}
                  styles={buildStyles({
                    pathColor: r.color,
                    textColor: "#333",
                    trailColor: "#eee",
                    textSize: "16px",
                  })}
                />
              </div>
            </div>

            <p
              className="mt-3 text-center font-semibold"
              style={{ color: r.color }}
            >
              {r.label}
            </p>
          </div>
        ))}
      </div>

      {shown.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md overflow-auto">
          <h3 className="mb-4 text-xl font-medium">
            Students: {selectedRange[0]} - {selectedRange[1]} LPA
          </h3>
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Salary</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4">{s.name}</td>
                  <td className="py-2 px-4">{s.email}</td>
                  <td className="py-2 px-4">
                    {parseFloat(s.predictedSalary).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 rounded bg-indigo-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2 py-1">
              {page}/{totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 rounded bg-indigo-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
