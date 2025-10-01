import React, { useState } from "react";
import { FaPaperclip, FaRegFileImage, FaTasks, FaUsers } from "react-icons/fa";
import { HiChatAlt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("Ms.SHH.Sewwandi");
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState([
    { sender: "CS003-S.Diveshkar", recipient: "Ms.SHH.Sewwandi", text: "Hello, I have a question about the assignment." },
    { sender: "Ms.SHH.Sewwandi", recipient: "CS003-S.Diveshkar", text: "Sure, what do you need help with?" },
  ]);
  const navigate = useNavigate();

  const recipients = ["Ms.SHH.Sewwandi", "Lecturer 2", "Lecturer 3"]; // Dummy data for recipients

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: "CS003-S.Diveshkar", recipient: selectedRecipient, text: message }]);
      setMessage("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-100 via-blue-100 to-white">
      {/* Left Section - Sidebar */}
      <div className="w-1/5 bg-blue-700 text-white p-4 space-y-6 rounded-lg shadow-lg">
        <div className="text-2xl font-semibold">Chat</div>
        <div className="space-y-4">
          <button className="w-full flex items-center space-x-2 hover:bg-blue-800 px-4 py-2 rounded-lg transition-all">
            <HiChatAlt />
            <span>Messages</span>
          </button>
          <button className="w-full flex items-center space-x-2 hover:bg-blue-800 px-4 py-2 rounded-lg transition-all">
            <FaTasks />
            <span>Tasks</span>
          </button>
          <button className="w-full flex items-center space-x-2 hover:bg-blue-800 px-4 py-2 rounded-lg transition-all">
            <FaRegFileImage />
            <span>Files</span>
          </button>
          <button className="w-full flex items-center space-x-2 hover:bg-blue-800 px-4 py-2 rounded-lg transition-all">
            <FaUsers />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Right Section - Main Chat */}
      <div className="flex-1 p-8 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Chat Room</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
            onClick={() => navigate("/event-dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Recipient Selection */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Chat with:</label>
          <select
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            className="p-3 border border-gray-300 rounded-md w-full"
          >
            {recipients.map((recipient, index) => (
              <option key={index} value={recipient}>
                {recipient}
              </option>
            ))}
          </select>
        </div>

        {/* Chat Window */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 h-96 overflow-auto">
          <div className="space-y-4">
            {messages
              .filter(
                (msg) =>
                  (msg.sender === "CS003-S.Diveshkar" && msg.recipient === selectedRecipient) ||
                  (msg.sender === selectedRecipient && msg.recipient === "CS003-S.Diveshkar")
              )
              .map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start ${
                    msg.sender === "CS003-S.Diveshkar" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-4 rounded-lg ${
                      msg.sender === "CS003-S.Diveshkar"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="font-semibold">{msg.sender}</div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="flex-1 p-3 rounded-md border border-gray-300"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white p-3 rounded-full"
            onClick={handleSendMessage}
          >
            Send
          </button>
          <button className="text-xl text-gray-600 p-3 hover:text-gray-900">
            <FaPaperclip />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;