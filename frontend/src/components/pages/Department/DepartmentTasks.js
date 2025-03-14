import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { TaskCard } from "./TaskCard";

export default function DepartmentTasks({tasks,setTasks}) {


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prevTasks) => {
        return prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        );
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {["Pending", "In Progress", "Completed"].map((status) => (
        <TaskColumn key={status} status={status} tasks={tasks} updateTaskStatus={updateTaskStatus} />
      ))}
    </div>
  );
}

function TaskColumn({ status, tasks, updateTaskStatus }) {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[300px]">
      <h2 className="text-xl font-bold mb-4">{status}</h2>
      {filteredTasks.map((task) => (
        <TaskCard key={task._id} task={task} updateTaskStatus={updateTaskStatus} />
      ))}
    </div>
  );
}