import { useState, useEffect, useRef } from "react";
import socket from "../../../services/socket";
import api from "../../../utils/api";
import FileMessage from "../Department/FileMessage";

export default function ChatBoxCollege({ departmentName, departmentId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const collegeId = sessionStorage.getItem("cityId");
  const collegeName = sessionStorage.getItem("cityName") || "College Admin";

  useEffect(() => {
    async function fetchChatHistory() {
      try {
        const response = await api.get("http://localhost:8000/message", {
          params: {
            sender: collegeId,
            senderModel: "College",
            receiver: departmentId,
            receiverModel: "Department",
          },
        });
        if (response.data.messages) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    }
    fetchChatHistory();
  }, [collegeId, departmentId]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("joinRoom", collegeId);

    const receiveMessageListener = (msg) => {
     
      if (
        (msg.sender === collegeId &&
          msg.senderModel === "College" &&
          msg.receiver === departmentId &&
          msg.receiverModel === "Department") ||
        (msg.sender === departmentId &&
          msg.senderModel === "Department" &&
          msg.receiver === collegeId &&
          msg.receiverModel === "College")
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", receiveMessageListener);

    return () => {
      socket.off("receiveMessage", receiveMessageListener);
      socket.emit("leaveRoom", collegeId);
    };
  }, [collegeId, departmentId]);

  const sendMessage = () => {
    if (message.trim()) {
      const msg = {
        sender: collegeId,
        senderModel: "College",
        receiver: departmentId,
        receiverModel: "Department",
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  const sendFile = async (file) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileData = response.data;
      const msg = {
        sender: collegeId,
        senderModel: "College",
        receiver: departmentId,
        receiverModel: "Department",
        file: fileData,
        message: "", // Empty message for file-only messages
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
    } catch (error) {
      console.error("Error uploading file:", error);
      // You might want to show an error message to the user
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      sendFile(file);
      // Reset file input
      e.target.value = null;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      sendFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`bg-white rounded-t-xl shadow-xl overflow-hidden transition-all duration-300 ${
        isMinimized ? "h-12" : "h-[500px]"
      }`}
    >
      {/* Chat Header */}
      <div
        className="bg-green-600 text-white p-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 p-1 rounded-full">
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
          </div>
          <h2 className="font-semibold">Chat with {departmentName}</h2>
        </div>
        <button className="text-white hover:text-green-200">
          {isMinimized ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div
            className="p-4 h-[calc(500px-130px)] overflow-y-auto bg-gray-50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="mt-2">No messages yet. Start the conversation!</p>
                <p className="text-sm mt-1">Drop files here to upload</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    msg.sender === collegeId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === collegeId
                        ? "bg-green-600 text-white"
                        : "bg-white border text-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">
                        {msg.sender === collegeId ? collegeName : departmentName}
                      </span>
                      <span className="text-xs opacity-70 ml-2">
                        {formatTime(msg.timestamp || new Date().toISOString())}
                      </span>
                    </div>
                    {msg.file ? (
                      <FileMessage
                        url={msg.file.url}
                        fileName={msg.file.fileName}
                        fileType={msg.file.fileType}
                        fileSize={msg.file.fileSize}
                      />
                    ) : (
                      <p className="text-sm">{msg.message}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Message Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                disabled={isUploading}
              >
                {isUploading ? (
                  <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .zip"
              />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Type your message or drop files here..."
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className={`p-2 rounded-full ${
                  message.trim()
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Supports images, PDFs, and other documents (max 25MB)
            </div>
          </div>
        </>
      )}
    </div>
  );
}