import React from "react";
import { FaBell, FaComments, FaUserCircle } from "react-icons/fa";

const TitleBar: React.FC = () => {
  return (
    <div className="flex sticky top-0 justify-between items-center px-6 py-4 bg-blue-900 text-white shadow-md w-full h-20">
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
        <button className="text-2xl hover:text-gray-300 transition">
          <FaUserCircle title="Profile" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
