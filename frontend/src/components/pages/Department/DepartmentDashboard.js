import React, { useState } from "react";
import { FaUsers, FaComments, FaFileUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Analytics from "./Analytics";
import api from "../../../utils/api";

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const departmentName = sessionStorage.getItem("departmentName");
  const departmentId = sessionStorage.getItem("departmentId");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("departmentId", departmentId);

    try {
      await api.post("/placements/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Upload successful! Model Training in Process.");
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed. Try again.");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <nav className="bg-blue-600 p-4 shadow-md">
        <div className="text-white font-bold text-lg">
          {departmentName} Department</div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div
          className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer"
          onClick={() => navigate("/departments/students")}
        >
          <FaUsers className="text-4xl text-purple-500" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">Manage Students</h2>
            <p>Add and View Students</p>
          </div>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer"
          onClick={() => navigate("/departments/collaborate")}
        >
          <FaComments className="text-4xl text-blue-500" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">Collaborate</h2>
            <p>Chat with other departments</p>
          </div>
        </div>

        {/* Excel Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaFileUpload className="text-4xl text-green-500" />
          <h2 className="text-xl font-semibold mt-2">Upload Placement Data</h2>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="mt-2"
          />
          {file && (
            <button
              onClick={handleUpload}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
          )}
          {message && <p className="mt-2 text-center">{message}</p>}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6 rounded-lg mx-6">
        <h2 className="text-xl font-semibold mb-4">Placement Analytics</h2>
        <Analytics id={departmentId} />
      </div>
    </div>
  );
}
