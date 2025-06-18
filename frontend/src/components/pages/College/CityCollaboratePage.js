import { useState, useEffect, useRef } from "react";
import api from "../../../utils/api";
import ChatBoxCity from "./ChatBoxCity";
import CreateDepartment from "./CreateDepartment";
import CollegeMeeting from "./CollegeMeeting";

export default function CityCollaboratePage() {
  const [departments, setDepartments] = useState([]);
  const [activeChat, setActiveChat] = useState("");
  const [activeDeptName, setActiveDeptName] = useState("");
  const [activeTab, setActiveTab] = useState("departments");
  const [showModal, setShowModal] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    title: "",
    date: "",
    time: "",
    agenda: "",
    selectedDepartments: [],
  });
  const [joinId, setJoinId] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [showMeeting, setShowMeeting] = useState(false);
  const cityId = sessionStorage.getItem("cityId");
  const cityName = sessionStorage.getItem("cityName");

  useEffect(() => {
    fetchDepartments();
    fetchUpcomingMeetings();
  }, [cityId]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get(`/departments/${cityId}`);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDepartmentSelection = (deptId) => {
    setMeetingDetails((prev) => {
      if (prev.selectedDepartments.includes(deptId)) {
        return {
          ...prev,
          selectedDepartments: prev.selectedDepartments.filter(
            (id) => id !== deptId
          ),
        };
      } else {
        return {
          ...prev,
          selectedDepartments: [...prev.selectedDepartments, deptId],
        };
      }
    });
  };

  const fetchUpcomingMeetings = async () => {
    try {
      const response = await api.get(`/meetings/upcoming/${cityId}`);
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching upcoming meetings:", error);
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    try {
      await api.post("/meetings/create", {
        ...meetingDetails,
        collegeId: cityId,
        departments: meetingDetails.selectedDepartments,
      });
      alert("Meeting scheduled successfully!");
      setMeetingDetails({
        title: "",
        date: "",
        time: "",
        agenda: "",
        selectedDepartments: [],
      });
      fetchUpcomingMeetings();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("Failed to schedule meeting");
    }
  };

  const handleJoinMeeting = (meetingId) => {
    if (!meetingId) {
      alert("Please enter a valid meeting ID");
      return;
    }
    setActiveMeeting(meetingId);
    setShowMeeting(true);
  };

  const handleCloseMeeting = () => {
    setShowMeeting(false);
    setActiveMeeting(null);
    fetchUpcomingMeetings(); // Refresh meetings list after leaving
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <CreateDepartment
              cityId={cityId}
              onSuccess={() => {
                setShowModal(false);
                fetchDepartments();
              }}
            />
          </div>
        </div>
      )}

      {showMeeting && (
        <CollegeMeeting
          meetingId={activeMeeting}
          onClose={handleCloseMeeting}
          userId={cityId}
          userName={cityName}
          userType="College"
        />
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between">
          <div>
            <h1 className="text-4xl font-bold text-indigo-800 mb-2">
              {cityName} Administration Hub
            </h1>
            <p className="text-lg text-indigo-600">
              Coordinate with all departments in your college
            </p>
          </div>
          <div>
            <div className="text-right mb-4">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + Create Department
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "departments"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("departments")}
            >
              Departments
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "schedule"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("schedule")}
            >
              Schedule Meeting
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "join"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("join")}
            >
              Join Meeting
            </button>
          </div>

          <div className="p-6">
            {activeTab === "departments" ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Department Communication
                  </h2>
                  <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {departments.length} Departments
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <div
                      key={dept._id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        activeChat === dept._id
                          ? "border-indigo-500 bg-indigo-50"
                          : "hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveChat(dept._id);
                        setActiveDeptName(dept.name);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {dept.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {activeChat && (
                  <div className="mt-6 border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">
                        Chat with {activeDeptName}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveChat("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="fixed bottom-4 right-4 w-96 z-50">
                      <ChatBoxCity
                        departmentName={activeDeptName}
                        departmentId={activeChat}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === "schedule" ? (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Schedule City-wide Meeting
                </h2>
                <form onSubmit={handleScheduleMeeting}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">
                        Meeting Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={meetingDetails.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Quarterly Review Meeting"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={meetingDetails.date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          name="time"
                          value={meetingDetails.time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Agenda</label>
                      <textarea
                        name="agenda"
                        value={meetingDetails.agenda}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Discuss quarterly goals, budget allocation, etc."
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Select Departments
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {departments.map((dept) => (
                          <div
                            key={dept._id}
                            onClick={() => toggleDepartmentSelection(dept._id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              meetingDetails.selectedDepartments.includes(
                                dept._id
                              )
                                ? "bg-indigo-100 border-indigo-500"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={meetingDetails.selectedDepartments.includes(
                                  dept._id
                                )}
                                readOnly
                                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                              />
                              <span>{dept.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={meetingDetails.selectedDepartments.length === 0}
                      className={`mt-6 w-full py-3 rounded-lg font-medium transition duration-200 ${
                        meetingDetails.selectedDepartments.length === 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      Schedule City-wide Meeting
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                {meetings.length === 0 ? (
                  <p className="text-gray-500">
                    No upcoming meetings scheduled.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="max-w-md mx-auto text-center">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Join a Meeting
                      </h2>
                      <input
                        type="text"
                        value={joinId}
                        onChange={(e) => setJoinId(e.target.value)}
                        placeholder="Enter Meeting ID"
                        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleJoinMeeting(joinId)}
                        disabled={!joinId.trim()}
                        className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                          !joinId.trim()
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        Join Meeting
                      </button>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Or select from upcoming meetings:
                      </h3>
                      <div className="space-y-3">
                        {meetings.map((meeting) => (
                          <div
                            key={meeting._id}
                            className="p-4 border rounded-lg hover:bg-indigo-50 transition duration-150 cursor-pointer"
                            onClick={() => handleJoinMeeting(meeting._id)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{meeting.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {meeting.agenda.substring(0, 50)}...
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="block text-sm text-indigo-600">
                                  {new Date(meeting.date).toLocaleDateString()} |{" "}
                                  {meeting.time}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ID: {meeting._id}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming College Meetings
          </h2>
          {meetings.length === 0 ? (
            <p className="text-gray-500">No upcoming meetings.</p>
          ) : (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="p-4 border rounded-lg hover:bg-indigo-50 transition duration-150 cursor-pointer"
                  onClick={() => handleJoinMeeting(meeting._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{meeting.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {meeting.agenda.substring(0, 50)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm text-indigo-600">
                        {new Date(meeting.date).toLocaleDateString()} |{" "}
                        {meeting.time}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {meeting._id}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}