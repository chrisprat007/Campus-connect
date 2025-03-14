import React, { useState, useEffect } from "react";
import socket from "../../../services/socket";
import api from "../../../utils/api";
const Chat = ({ senderId, receiverId }) => {
    const [messages, setMessages] = useState([]); // Stores chat messages
    const [newMessage, setNewMessage] = useState(""); // Stores the current input

    useEffect(() => {
        api.get(`http://localhost:8000/message?sender=${senderId}&receiver=${receiverId}`)
            .then((res) => res.json())
            .then((data) => setMessages(data.messages));

        socket.on("receiveMessage", (message) => {
            console.log(message);
            setMessages((prev) => [...prev, message]);
        });


        return () => socket.off("receiveMessage");
    }, [senderId, receiverId]);

    const sendMessage = () => {
        if (newMessage.trim() === "") return;

        const message = {
            sender: senderId,
            receiver: receiverId,
            message: newMessage,
        };

        socket.emit("sendMessage", message);


        setMessages((prev) => [...prev, message]);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${(msg.sender === senderId ||
                                msg.sender._id === senderId) ? "justify-end" : "justify-start"
                            } mb-2`}
                    >
                        <div
                            className={`p-3 rounded-lg text-white ${msg.sender===senderId || msg.sender._id === senderId ? "bg-blue-500" : "bg-gray-400"
                                }`}
                        >
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Section */}
            <div className="flex items-center">
                <input
                    type="text"
                    className="flex-grow border rounded-lg px-3 py-2 mr-2"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
