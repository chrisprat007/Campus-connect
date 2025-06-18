import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Dashboard from "../components/pages/College/Dashboard";
import Navbar from "../components/Navbar";
import DepartmentList from "../components/pages/DepartmentList";
import { useApi } from "../context/ApiContext";
import DepartmentLogin from "../components/auth/DepartmentLogin";
import DepartmentDashboard from "../components/pages/Department/DepartmentDashboard";
import DepartmentCollaboratePage from "../components/pages/Department/DepartmentCollaboratePage";
import CityCollaboratePage from "../components/pages/College/CityCollaboratePage";
import StudentsPage from "../components/pages/StudentsPage";
import CollegeMeeting from "../components/pages/College/CollegeMeeting";
import StudentDashboard from "../components/pages/Student/StudentDashboard";
import StudentLogin from "../components/auth/StudentLogin";

export default function AppRouter() {
  const { cityLogged, departmentLogged, studentLogged } = useApi();
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <Router className="bg-gradient-to-br from-blue-50 to-indigo-100">
        {cityLogged && (
          <div className="min-h-screen text-gray-900">
            <Navbar />
            <div className="container mx-auto p-4">
              <Routes>
                {/* <Route path="/departments" element={<DepartmentList />} /> */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/meeting" element={<CollegeMeeting />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/city/login" element={<Login />} />
                <Route
                  path="/collaborate/departments"
                  element={<CityCollaboratePage />}
                />
              </Routes>
            </div>
            {/* <ChatBox /> */}
          </div>
        )}
        {departmentLogged && (
          <Routes>
            <Route path="/meeting" element={<CollegeMeeting />} />
            <Route path="/departments/students" element={<StudentsPage />} />
            <Route path="*" element={<DepartmentDashboard />} />
            <Route
              path="/departments/dashboard"
              element={<DepartmentDashboard />}
            />
            <Route
              path="/departments/collaborate"
              element={<DepartmentCollaboratePage />}
            />
          </Routes>
        )}
        {studentLogged && (
          <Routes>
            <Route path="*" element={<StudentDashboard />} />
            <Route path="/dashboard/student" element={<StudentDashboard />} />
          </Routes>
        )}
        {!cityLogged && !departmentLogged && !studentLogged && (
          <Routes>
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="*" element={<Login />} />
            <Route path="/department/login" element={<DepartmentLogin />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}
