import { useEffect, useState } from "react";
import api from "../../utils/api";
import CreateDepartment from "./College/CreateDepartment";
import { useApi } from "../../context/ApiContext";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const {cityId} = useApi() 

  const fetchDepartments = () => {
    setLoading(true);
    api.get(`/departments/${cityId}`)
      .then((res) => {
        console.log(res.data);
        setDepartments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-8">City Departments</h1>

     
      <div className="text-right mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Create Department
        </button>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <CreateDepartment cityId={cityId} onSuccess={() => { setShowModal(false); fetchDepartments(); }} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-800 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept._id} className="relative bg-indigo-900 p-6 rounded-xl shadow-lg border border-gray-700 transition-transform transform hover:scale-105 hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-white">{dept.name}</h2>
              <p className="text-sm text-gray-200 mt-1">{dept.role}</p>
              <p className="text-sm text-gray-200 mt-2">College: {dept.college?.name || "N/A"}</p>

              

              <div className="absolute top-2 right-2 px-3 py-1 text-xs bg-blue-600 text-white rounded-full">
                {dept.role}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
