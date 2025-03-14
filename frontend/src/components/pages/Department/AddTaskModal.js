import { useState } from "react";
import api from "../../../utils/api";

export default function AddTaskModal({ onClose, onTaskAdded }) {
  const departmentId=sessionStorage.getItem("departmentId");
  const [taskData, setTaskData] = useState({
    
    name: "",
    description: "",
    department:departmentId,
    status: "Pending",
  });
  
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/tasks/", taskData);
      onTaskAdded(response.data);
      onClose();  
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Task Name</label>
            <input
              type="text"
              name="name"
              value={taskData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={taskData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
