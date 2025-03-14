import { useState } from "react";
import ChatBoxDepartment from "./ChatBoxDepartment";

export default function DepartmentCollaboratePage() {
  
  const cityId = sessionStorage.getItem("cityId");
  const cityName = sessionStorage.getItem("cityName");

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Department Dashboard</h1>
      <p className="mb-4">Chat with your college admin ({cityName})</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={() => setChatOpen(true)}
      >
        Open Chat
      </button>

      {chatOpen && <ChatBoxDepartment cityName={cityName} cityId={cityId} />}
    </div>
  );
}
