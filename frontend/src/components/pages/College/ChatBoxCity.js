import { useState, useEffect, useRef } from "react";
import socket from "../../../services/socket";
import api from "../../../utils/api";

export default function ChatBoxCollege({ departmentName, departmentId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const collegeId = sessionStorage.getItem("cityId");

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
        message,
      };
      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-lg w-96">
      <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat with {departmentName}</h2>
      </div>
      <div className="p-4 h-60 overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index} className="text-sm">
            <strong>{msg.sender === collegeId ? "You" : departmentName}</strong>: {msg.message}
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
        <button onClick={sendMessage} className="bg-green-600 text-white px-4 py-2 rounded-r-md">
          Send
        </button>
      </div>
    </div>
  );
}
