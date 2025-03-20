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

export default function AppRouter() {
  const { cityLogged,departmentLogged } = useApi();
  return (
    <Router>
      {cityLogged && (
        <div className="min-h-screen bg-gray-100 text-gray-900">
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/departments" element={<DepartmentList />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/city/login" element={<Login />} />
              <Route path="/collaborate/departments" element={<CityCollaboratePage />} />
            </Routes>
          </div>
          {/* <ChatBox /> */}
        </div>
      )}
      {departmentLogged && (
        <Routes>
        <Route path="/departments/students" element={<StudentsPage />} />
        <Route path="*" element={<DepartmentDashboard />} />
        <Route path="/departments/dashboard" element={<DepartmentDashboard />} />
        <Route path="/departments/collaborate" element={<DepartmentCollaboratePage/>} />
      </Routes>
      )}
      {!cityLogged && !departmentLogged && (
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/department/login" element={<DepartmentLogin />} />
        </Routes>
      )}
    </Router>
  );
}
