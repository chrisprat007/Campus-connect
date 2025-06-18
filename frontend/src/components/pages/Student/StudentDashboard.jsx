import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaHashtag,
  FaBuilding,
  FaMapMarkerAlt,
  FaDollarSign,
  FaRobot,
  FaGraduationCap,
  FaCode,
  FaAward,
  FaBriefcase,
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useApi } from "../../../context/ApiContext";
import api from "../../../utils/api";
import MiniPieChart from "./MiniPieChart";
import CertificationsSection from "./CertificationsSections";
import AchievementsSection from "./AchievementsSection";
import InternshipsSection from "./InternshipsSection";

const StudentDashboard = () => {
  const { studentLogged } = useApi();
  const [studentData, setStudentData] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [tempData, setTempData] = useState({});
  const studentId = sessionStorage.getItem("studentId");

  const fetchStudent = async () => {
    try {
      const res = await api.get(`/students/${studentId}`);
      setStudentData(res.data);
    } catch (err) {
      console.error("Failed to fetch student data", err);
    }
  };

  useEffect(() => {
    if (studentId) fetchStudent();
  }, [studentId]);

  if (!studentData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const displayValue = (key) => {
    if (key === "predictedSalary") {
      return `$${studentData.predictedSalary?.toLocaleString()}`;
    }
    if (key === "department") {
      return studentData.department?.name || "";
    }
    if (key === "college") {
      return studentData.college?.name || "";
    }
    return studentData[key] ?? "";
  };

  const startEditing = (section) => {
    setEditingSection(section);
    if (section === "profile") {
      setTempData({
        name: studentData.name,
        email: studentData.email,
        rollNumber: studentData.rollNumber,
        predictedSalary: studentData.predictedSalary,
      });
    } else if (section === "cgpa") {
      setTempData({ cgpa: studentData.cgpa });
    } else if (section === "skills") {
      setTempData({ features: { ...studentData.features } });
    } else if (section === "projects") {
      setTempData({ projects: [...studentData.projects] });
    } else if (section === "certifications") {
      setTempData({ certifications: [...studentData.certifications] });
    } else if (section === "achievements") {
      setTempData({ achievements: [...studentData.achievements] });
    } else if (section === "internships") {
      setTempData({ internships: [...studentData.internships] });
    }
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setTempData({});
  };

  const saveSection = async () => {
    try {
      const sid = sessionStorage.getItem("studentId");
      if (!sid) return;

      // 🔍 Recursive check: every field must NOT be an empty string
      const allFieldsEmpty = (obj) => {
        if (typeof obj === "string") return obj.trim() === "";
        if (Array.isArray(obj))
          return obj.length === 0 || obj.every(allFieldsEmpty);
        if (typeof obj === "object" && obj !== null) {
          const values = Object.values(obj);
          return values.length === 0 || values.every(allFieldsEmpty);
        }
        return obj === null || obj === undefined;
      };

      if (allFieldsEmpty(tempData)) {
        alert("Please fill at least one field before saving.");
        return;
      }

      let endpoint = "";
      let payload = {};

      switch (editingSection) {
        case "profile":
          endpoint = "/students/updateProfile";
          payload = {
            studentId: sid,
            name: tempData.name,
            email: tempData.email,
            rollNumber: tempData.rollNumber,
            predictedSalary: tempData.predictedSalary,
          };
          break;
        case "cgpa":
          endpoint = "/students/updateCgpa";
          payload = { studentId: sid, cgpa: tempData.cgpa };
          break;
        case "skills":
          endpoint = "/students/updateSkills";
          payload = { studentId: sid, features: tempData.features };
          break;
        case "projects":
          endpoint = "/students/updateProjects";
          payload = { studentId: sid, projects: tempData.projects };
          break;
        case "certifications":
          endpoint = "/students/updateCertifications";
          payload = { studentId: sid, certifications: tempData.certifications };
          break;
        case "achievements":
          endpoint = "/students/updateAchievements";
          payload = { studentId: sid, achievements: tempData.achievements };
          break;
        case "internships":
          endpoint = "/students/updateInternships";
          payload = { studentId: sid, internships: tempData.internships };
          break;
        default:
          return;
      }

      await api.put(endpoint, payload);
      setStudentData((prev) => ({ ...prev, ...tempData }));
      setEditingSection(null);
      setTempData({});
    } catch (err) {
      console.error("Failed to save", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {studentData.name}</p>
          </div>
          {studentLogged && (
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FaRobot className="w-4 h-4" />
              AI Suggestions
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaUser className="w-5 h-5" /> Student Profile
            </h2>
            {editingSection !== "profile" ? (
              <button
                onClick={() => startEditing("profile")}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={saveSection}
                  className="text-green-600 hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="text-red-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Name", key: "name", icon: <FaUser /> },
              { label: "Email", key: "email", icon: <FaEnvelope /> },
              { label: "Roll Number", key: "rollNumber", icon: <FaHashtag /> },
              { label: "Department", key: "department", icon: <FaBuilding /> },
              { label: "College", key: "college", icon: <FaMapMarkerAlt /> },
              {
                label: "Predicted Salary",
                key: "predictedSalary",
                icon: <FaDollarSign />,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="text-gray-500">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  {editingSection === "profile" &&
                  ["name", "email", "rollNumber", "predictedSalary"].includes(
                    item.key
                  ) ? (
                    <input
                      type={item.key === "predictedSalary" ? "number" : "text"}
                      value={tempData[item.key] ?? ""}
                      onChange={(e) =>
                        setTempData((prev) => ({
                          ...prev,
                          [item.key]:
                            item.key === "predictedSalary"
                              ? Number(e.target.value)
                              : e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    <p className="font-medium">{displayValue(item.key)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaGraduationCap /> CGPA Overview
              </h2>
              {editingSection !== "cgpa" ? (
                <button
                  onClick={() => startEditing("cgpa")}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={saveSection}
                    className="text-green-600 hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              {editingSection === "cgpa" ? (
                <input
                  type="number"
                  step="0.01"
                  value={tempData.cgpa ?? ""}
                  onChange={(e) =>
                    setTempData((prev) => ({
                      ...prev,
                      cgpa: parseFloat(e.target.value),
                    }))
                  }
                  className="w-28 text-center border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <div className="w-28 h-28">
                  <CircularProgressbar
                    value={(studentData.cgpa / 10) * 100}
                    text={`${studentData.cgpa}/10`}
                    styles={buildStyles({
                      pathColor: "#3b82f6",
                      textColor: "#333",
                      trailColor: "#eee",
                      textSize: "16px",
                    })}
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">Current CGPA</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold">Skills Assessment</h2>
              {editingSection !== "skills" ? (
                <button
                  onClick={() => startEditing("skills")}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={saveSection}
                    className="text-green-600 hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <MiniPieChart
                data={[
                  {
                    value: studentData.features.technicalSkills,
                    color: "#10b981",
                  },
                  {
                    value: studentData.features.communication,
                    color: "#f59e0b",
                  },
                  { value: studentData.features.leadership, color: "#ef4444" },
                  {
                    value: studentData.features.problemSolving,
                    color: "#8b5cf6",
                  },
                ]}
                size={120}
              />
              <div className="mt-4 space-y-2 w-full">
                {[
                  "technicalSkills",
                  "communication",
                  "leadership",
                  "problemSolving",
                ].map((key, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: [
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                          ][i],
                        }}
                      />
                      <span className="text-gray-600">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase())}
                      </span>
                    </div>
                    {editingSection === "skills" ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={tempData.features[key] ?? ""}
                        onChange={(e) =>
                          setTempData((prev) => ({
                            ...prev,
                            features: {
                              ...prev.features,
                              [key]: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-right"
                      />
                    ) : (
                      <span className="font-medium">
                        {studentData.features[key]}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaCode /> Project Status
            </h2>
            {editingSection !== "projects" ? (
              <button
                onClick={() => startEditing("projects")}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={saveSection}
                  className="text-green-600 hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="text-red-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center">
              <MiniPieChart
                data={[
                  {
                    value: studentData.projects.filter(
                      (p) => p.status === "Completed"
                    ).length,
                    color: "#10b981",
                  },
                  {
                    value: studentData.projects.filter(
                      (p) => p.status === "In Progress"
                    ).length,
                    color: "#f59e0b",
                  },
                ]}
                size={120}
              />
              <div className="text-center mt-4">
                <p className="text-2xl font-bold text-green-600">
                  {studentData.projects.length}
                </p>
                <p className="text-sm text-gray-500">Total Projects</p>
              </div>
            </div>
            <div className="flex-1 mt-4 space-y-3">
              {editingSection === "projects"
                ? tempData.projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2"
                    >
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => {
                          const updated = [...tempData.projects];
                          updated[idx].name = e.target.value;
                          setTempData((prev) => ({
                            ...prev,
                            projects: updated,
                          }));
                        }}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        placeholder="Project Name"
                      />
                      <input
                        type="text"
                        value={project.tech}
                        onChange={(e) => {
                          const updated = [...tempData.projects];
                          updated[idx].tech = e.target.value;
                          setTempData((prev) => ({
                            ...prev,
                            projects: updated,
                          }));
                        }}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        placeholder="Technologies"
                      />
                      <select
                        value={project.status}
                        onChange={(e) => {
                          const updated = [...tempData.projects];
                          updated[idx].status = e.target.value;
                          setTempData((prev) => ({
                            ...prev,
                            projects: updated,
                          }));
                        }}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                      <button
                        onClick={() => {
                          const updated = tempData.projects.filter(
                            (_, i) => i !== idx
                          );
                          setTempData((prev) => ({
                            ...prev,
                            projects: updated,
                          }));
                        }}
                        className="text-red-600 hover:underline text-sm self-end"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                : studentData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-600">
                            {project.tech}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            project.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
              {editingSection === "projects" && (
                <button
                  onClick={() =>
                    setTempData((prev) => ({
                      ...prev,
                      projects: [
                        ...prev.projects,
                        { name: "", tech: "", status: "In Progress" },
                      ],
                    }))
                  }
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Add Project
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CertificationsSection
            certifications={studentData.certifications}
            editingSection={editingSection}
            tempData={tempData}
            setTempData={setTempData}
            startEditing={startEditing}
            saveSection={saveSection}
            cancelEditing={cancelEditing}
          />

          <AchievementsSection
            achievements={studentData.achievements}
            editingSection={editingSection}
            tempData={tempData}
            setTempData={setTempData}
            startEditing={startEditing}
            saveSection={saveSection}
            cancelEditing={cancelEditing}
          />
        </div>

        <InternshipsSection
          internships={studentData.internships}
          editingSection={editingSection}
          tempData={tempData}
          setTempData={setTempData}
          startEditing={startEditing}
          saveSection={saveSection}
          cancelEditing={cancelEditing}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
