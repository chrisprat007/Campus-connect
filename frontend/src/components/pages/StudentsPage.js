import React, { useState, useEffect } from "react";
import { FaUpload, FaFileExcel } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function StudentsPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState(""); // "name" for ascending, "cgpa" for descending
  const navigate = useNavigate();
  const departmentId = sessionStorage.getItem("departmentId");
  const departmentName = sessionStorage.getItem("departmentName");

  const recordsPerPage = 25;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    // Validate file type (.xls or .xlsx)
    if (!selectedFile.name.match(/\.(xls|xlsx)$/)) {
      setError("Please upload a valid Excel file (.xls or .xlsx)");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an Excel file before uploading.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    const fileToUpload = new File([file], file.name, { type: file.type });
    formData.append("file", fileToUpload);
    try {
      await api.post(`/students/upload/${departmentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Students uploaded successfully!");
      setFile(null);
      fetchStudents();
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/departments/students/${departmentId}`);
      setStudents(res.data.students);
      console.log(res);
      setCurrentPage(1); 
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students by name and department (if selected)
  const filteredStudents = students.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesDept = filterDepartment ? student.department === filterDepartment : true;
    return matchesName && matchesDept;
  });

  // Sorting based on selected sort type
  const sortedStudents = [...filteredStudents];
  if (sortType === "name") {
    sortedStudents.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === "cgpa") {
    sortedStudents.sort((a, b) => b.cgpa - a.cgpa);
  }

  // Pagination logic
  const totalPages = Math.ceil(sortedStudents.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedStudents.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Compact Upload Widget at Top Right */}
      <div className="absolute top-4 right-4">
        <div className="bg-white p-2 rounded shadow-md flex items-center space-x-2">
          <label className="cursor-pointer flex items-center">
            <FaFileExcel className="text-green-500 text-xl" />
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className={`p-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading" : <FaUpload />}
          </button>
        </div>
        {file && (
          <div className="mt-1 text-sm text-gray-600 text-right">
            {file.name}
          </div>
        )}
        {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
      </div>

      <h1 className="text-3xl font-bold mb-6">Student Details</h1>

      {/* Filter Options & Sorting */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-64 mb-4 sm:mb-0"
          />
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => setSortType("name")}
            className={`px-4 py-2 rounded ${
              sortType === "name" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Sort Name ↑
          </button>
          <button
            onClick={() => setSortType("cgpa")}
            className={`px-4 py-2 rounded ${
              sortType === "cgpa" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Sort CGPA ↓
          </button>
        </div>
      </div>

      {/* Student Details Table */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Name",
                "Email",
                "Roll Number",
                "Department",
                "CGPA",
                "Certifications",
                "Achievements",
                "Internships",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRecords.map((student, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">{student.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{student.email}</td>
                <td className="px-4 py-2 whitespace-nowrap">{student.rollNumber}</td>
                <td className="px-4 py-2 whitespace-nowrap">{departmentName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{student.cgpa}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {student.certifications &&
                    student.certifications.map((cert) => cert.name).join(", ")}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {student.achievements &&
                    student.achievements.map((ach) => ach.title).join(", ")}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {student.internships &&
                    student.internships.map((intern) => intern.company).join(", ")}
                </td>
              </tr>
            ))}
            {currentRecords.length === 0 && (
              <tr>
                <td className="px-4 py-2 text-center" colSpan="8">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => paginate(pageNum)}
            className={`px-3 py-1 rounded ${
              currentPage === pageNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {pageNum}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      <button
        onClick={() => navigate("/departments")}
        className="mt-4 text-blue-600 hover:underline"
      >
        ← Back to Department
      </button>
    </div>
  );
}
