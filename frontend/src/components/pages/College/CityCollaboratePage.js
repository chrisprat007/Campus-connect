import { useState, useEffect } from "react";
import api from "../../../utils/api";
import ChatBoxCity from "./ChatBoxCity";

export default function CityCollaboratePage() {
  const [departments, setDepartments] = useState([]);
  const [activeChat, setActiveChat] = useState("");
  const [activeDeptName, setActiveDeptName] = useState("");
  const cityId = sessionStorage.getItem("cityId");

  useEffect(() => {
    fetchDepartments();
  }, [cityId]);

  const fetchDepartments = async () => {
    try {
      // Fetch departments associated with the city.
      const response = await api.get(`/departments/${cityId}`);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">
        City Dashboard – Collaborate with Departments
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept._id}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200"
            onClick={() => {
              setActiveChat(dept._id);
              setActiveDeptName(dept.name);
            }}
          >
            <h2 className="text-xl font-semibold">{dept.name}</h2>
          </div>
        ))}
      </div>

      {activeChat && (
        <ChatBoxCity departmentName={activeDeptName} departmentId={activeChat} />
      )}
    </div>
  );
}
