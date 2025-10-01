import React from "react";
import { FaBell, FaComments, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TitleBar: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the UserProfile page
  };

  return (
    <div className="flex sticky z-[1000] top-0 justify-between items-center px-6 py-4 bg-blue-900 text-white shadow-md w-full h-20">
      {/* Title */}
      <h1 className="text-2xl font-bold">NHDN University of Sri Lanka</h1>

      {/* Action Icons: Notifications, Chat, Profile */}
      <div className="flex items-center space-x-6">
        <button className="text-xl hover:text-gray-300 transition">
          <FaComments title="Chat" />
        </button>
        <button className="text-xl hover:text-gray-300 transition">
          <FaBell title="Notifications" />
        </button>
        <button
          className="text-2xl hover:text-gray-300 transition"
          onClick={handleProfileClick} // Add onClick handler
        >
          <FaUserCircle title="Profile" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;