import { useEffect, useState } from "react";
import ChatBoxDepartment from "./ChatBoxDepartment";
import CollegeMeeting from "../College/CollegeMeeting";
import api from "../../../utils/api";

export default function DepartmentCollaboratePage() {
  const cityId = sessionStorage.getItem("cityId");
  const cityName = sessionStorage.getItem("cityName");
  const departmentName = sessionStorage.getItem("departmentName");
  const [activeTab, setActiveTab] = useState("home");
  const [showChat, setShowChat] = useState(false);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const departmentId = sessionStorage.getItem("departmentId");
  const [joinId, setJoinId] = useState("");
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [showMeeting, setShowMeeting] = useState(false);

  useEffect(() => {
    fetchUpcomingMeetings();
  }, []);

  const fetchUpcomingMeetings = async () => {
    try {
      const response = await api.get(
        `/meetings/upcoming/department/${departmentId}/${cityId}`
      );
      setUpcomingMeetings(response.data);
    } catch (error) {
      console.error("Error fetching upcoming meetings:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 relative">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            {departmentName} Collaboration Hub
          </h1>
          <p className="text-lg text-indigo-600">
            Working together for {cityName} administration
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "home"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("home")}
            >
              Home
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
            {activeTab === "home" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Collaboration Tools */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-indigo-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-indigo-800">
                        Quick Actions
                      </h2>
                      <button
                        onClick={() => setShowChat(!showChat)}
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        <span>
                          {showChat ? "Hide Chat" : "Chat with Admin"}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className="bg-white p-4 rounded-lg border border-indigo-100 cursor-pointer hover:border-indigo-300 transition"
                        onClick={() => setActiveTab("join")}
                      >
                        <h3 className="font-medium text-indigo-800 mb-2">
                          Join Meeting
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Enter a meeting ID to join
                        </p>
                        <div className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                          Join Meeting →
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Upcoming Meetings */}
                <div className="space-y-6">
                  <div className="bg-indigo-50 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                      Upcoming Meetings
                    </h2>
                    <div className="space-y-3">
                      {upcomingMeetings.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No upcoming meetings scheduled
                        </p>
                      ) : (
                        upcomingMeetings.map((meeting) => (
                          <div
                            key={meeting._id}
                            className="p-4 bg-white rounded-lg border hover:border-indigo-300 transition duration-150 cursor-pointer"
                            onClick={() => handleJoinMeeting(meeting._id)}
                          >
                            <div className="flex justify-between">
                              <h3 className="font-medium">{meeting.title}</h3>
                              <span className="text-sm text-indigo-600">
                                {new Date(meeting.date).toLocaleDateString()} at{" "}
                                {meeting.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {meeting.agenda.substring(0, 50)}...
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Meeting ID: {meeting._id}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
                  Join a Meeting
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Meeting ID
                    </label>
                    <input
                      type="text"
                      value={joinId}
                      onChange={(e) => setJoinId(e.target.value)}
                      placeholder="Enter the meeting ID"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
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
                  <button
                    onClick={() => setActiveTab("home")}
                    className="w-full py-2 text-indigo-600 hover:text-indigo-800"
                  >
                    ← Back to Home
                  </button>
                </div>
                {showMeeting && (
                  <CollegeMeeting
                    meetingId={joinId}
                    userId={"23"}
                    userName="abc"
                    userTyep="college"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Box */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 z-10">
          <ChatBoxDepartment cityName={cityName} cityId={cityId} />
        </div>
      )}
    </div>
  );
}
