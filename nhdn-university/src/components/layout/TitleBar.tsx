import React from "react";
import { FaBell } from "react-icons/fa";

const TitleBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-900 text-white shadow-md w-full h-20">
      <h1 className="text-2xl font-bold">NHDN University of Sri Lanka</h1>
      <button className="text-xl hover:text-gray-300 transition">
        <FaBell />
      </button>
    </div>
  );
};

export default TitleBar;
