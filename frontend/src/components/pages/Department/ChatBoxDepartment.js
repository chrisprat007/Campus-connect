import { useState, useEffect, useRef } from "react";
import socket from "../../../services/socket";
import api from "../../../utils/api";

export default function ChatBoxDepartment({ cityName, cityId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  // Department user is logged in; its ID is stored in sessionStorage
  const departmentId = sessionStorage.getItem("departmentId");

  // Load chat history between the department and the city
  useEffect(() => {
    async function fetchChatHistory() {
      try {
        const response = await api.get("http://localhost:8000/message", {
          params: {
            sender: departmentId,
            senderModel: "Department",
            receiver: cityId,
            receiverModel: "City",
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
  }, [departmentId, cityId]);

  // Set up socket connection and listeners
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    // Join a room with the department's id so it receives messages sent to it
    socket.emit("joinRoom", departmentId);

    const receiveMessageListener = (msg) => {
      // Only add messages between this department and the city
      if (
        (msg.sender === departmentId &&
          msg.senderModel === "Department" &&
          msg.receiver === cityId &&
          msg.receiverModel === "City") ||
        (msg.sender === cityId &&
          msg.senderModel === "City" &&
          msg.receiver === departmentId &&
          msg.receiverModel === "Department")
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", receiveMessageListener);

    return () => {
      socket.off("receiveMessage", receiveMessageListener);
      socket.emit("leaveRoom", departmentId);
    };
  }, [departmentId, cityId]);

  const sendMessage = () => {
    if (message.trim()) {
      const msg = {
        sender: departmentId,
        senderModel: "Department",
        receiver: cityId,
        receiverModel: "City",
        message,
      };
      socket.emit("sendMessage", msg);
      // Optimistically update the UI
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  // Auto-scroll to the bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-lg w-96">
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat with {cityName}</h2>
      </div>

      <div className="p-4 h-60 overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index} className="text-sm">
            <strong>{msg.sender === departmentId ? "You" : cityName}</strong>:{" "}
            {msg.message}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-2 border-t">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border rounded-l-md focus:outline-none"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-r-md">
          Send
        </button>
      </div>
    </div>
  );
}
