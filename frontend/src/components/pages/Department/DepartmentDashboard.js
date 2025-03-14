import { useEffect, useState } from "react";
import { FaTasks, FaUsers, FaCog, FaPlus, FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import AddTaskModal from "./AddTaskModal";  
import DepartmentTasks from "./DepartmentTasks";

export default function DepartmentDashboard() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const navigate = useNavigate();

  const departmentName = sessionStorage.getItem("departmentName");
  const departmentId = sessionStorage.getItem("departmentId");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`tasks/${departmentId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{departmentName}</h1>
        <button onClick={() => setIsModalOpen(true)} className="p-2 bg-blue-600 text-white rounded-lg flex items-center">
          <FaPlus className="mr-2" /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaTasks className="text-4xl text-green-500" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <p>{tasks.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FaCog className="text-4xl text-red-500" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p>Manage department settings</p>
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer" onClick={() => navigate("/departments/collaborate")}>
          <FaComments className="text-4xl text-blue-500" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">Collaborate</h2>
            <p>Chat with other departments</p>
          </div>
        </div>
      </div>

      <DepartmentTasks tasks={tasks} setTasks={setTasks} />

      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} onTaskAdded={handleTaskAdded} />}
    </div>
  );
}
