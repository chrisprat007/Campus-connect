import { useState, useEffect } from "react";
import api from "../../hooks/useApi";
import StatCard from "../../components/StatCard";
import Icon from "../../components/Icon";
import Loader from "../../components/Loader";

const avatarGradients = [
  ["#4f46e5", "#818cf8"],
  ["#0891b2", "#06b6d4"],
  ["#059669", "#10b981"],
  ["#d97706", "#f59e0b"],
  ["#7c3aed", "#a78bfa"],
  ["#db2777", "#f472b6"],
];

const companyData = [
  { name: "Google", count: 8 },
  { name: "Microsoft", count: 14 },
  { name: "Amazon", count: 22 },
  { name: "Flipkart", count: 18 },
  { name: "Razorpay", count: 11 },
  { name: "Swiggy", count: 9 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
      
  }, []);

  const handleSemanticSearch = async () => {
    if (!searchQ.trim()) return;

    try {
      setSearchLoading(true);
      setSearchResults([]);

      const res = await api.post("/semanticsearch/admin", {
        query: searchQ,
      });

      setSearchResults(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSemanticSearch();
  };

  if (loading) return <Loader />;

  const statCards = [
    {
      label: "Total Students",
      value: stats?.totalStudents || 0,
      sub: "Registered",
      from: "#4f46e5",
      to: "#818cf8",
      icon: "users",
    },
    {
      label: "Interview Experiences",
      value: stats?.totalInterviews || 0,
      sub: "Shared experiences",
      from: "#0891b2",
      to: "#06b6d4",
      icon: "star",
    },
  ];

  const batchData = stats?.batchData || [];
  const maxBatch = Math.max(...batchData.map((b) => b.placed || 0), 1);


  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-slate-500 text-sm mb-1">Administrator</p>
        <h1 className="text-3xl font-extrabold text-slate-800">
          Placement Overview
        </h1>
        <p className="text-slate-500 mt-1">Academic Year 2024–25</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* 🔥 Semantic Search Section */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Icon name="search" size={16} className="text-brand-500" />
          Semantic Search
        </h3>

        <div className="relative mb-4">
          <Icon
            name="search"
            size={16}
            className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            className="input-field pl-10"
            placeholder="Search students semantically (e.g. React developer with fintech internship)"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Loader */}
        {searchLoading && (
          <div className="py-6 flex justify-center">
            <Loader />
          </div>
        )}

        {/* Results Table */}
        {!searchLoading && searchResults.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    "Student",
                    "Phone",
                    "Department",
                    "Domain",
                   
                    "Batch",
                    "Matched Content",
                    "Score",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {searchResults.map((s, idx) => {
                  const [from, to] =
                    avatarGradients[idx % avatarGradients.length];
                  const initials = s.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={s.studentId}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      {/* Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            style={{
                              background: `linear-gradient(135deg,${from},${to})`,
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-700">
                              {s.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {s.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {s.phone || "—"}
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {s.department || "—"}
                      </td>

                      {/* Domain */}
                      <td className="px-5 py-4">
                        <span className="badge text-xs bg-brand-50 text-brand-600">
                          {s.domain || "—"}
                        </span>
                      </td>

                      {/* CGPA
                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-bold ${
                            s.cgpa >= 8.5
                              ? "text-emerald-600"
                              : s.cgpa >= 7.5
                                ? "text-amber-600"
                                : "text-slate-500"
                          }`}
                        >
                          {s.cgpa || "—"}
                        </span>
                      </td> */}

                      {/* Batch */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {s.batch || "—"}
                      </td>

                      {/* Matched Content */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="text-xs text-slate-600 line-clamp-3">
                          {s.matchedContent || "—"}
                        </div>
                      </td>

                      {/* Score */}
                      <td className="px-5 py-4 text-xs font-semibold text-slate-400">
                        {s.score ? s.score.toFixed(3) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!searchLoading && searchQ && searchResults.length === 0 && (
          <div className="text-sm text-slate-400 text-center py-4">
            No semantic results found
          </div>
        )}
      </div>

      {/* Existing Charts Section (unchanged) */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-6">Placements by Batch</h3>
          {batchData.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">
              No batch data yet
            </p>
          ) : (
            <div className="flex items-end gap-4 h-40">
              {batchData.slice(0, 6).map((b) => (
                <div
                  key={b.batch}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="text-xs font-semibold text-brand-600">
                    {b.placed}
                  </div>
                  <div
                    className="w-full flex flex-col gap-1 items-center"
                    style={{ height: "100px", justifyContent: "flex-end" }}
                  >
                    <div
                      className="chart-bar w-full"
                      style={{ height: `${(b.placed / maxBatch) * 90}px` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 truncate w-full text-center">
                    {b.batch}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
