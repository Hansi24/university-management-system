import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import backgroundImage from "../../assets/background.jpeg";

const BookResources = () => {
  const location = useLocation();
  const { selectedResource } = location.state || {};

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="flex w-full min-h-screen bg-gray-100" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <SideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="flex-1 p-6">
        <div className="flex flex-col w-96 mx-auto p-6 space-y-4 bg-white shadow-lg border rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Book a Resource</h2>
          <input
            type="text"
            placeholder="Enter subject"
            className="border px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          {/* Display and Select Resource */}
            <div className="border px-4 py-2 rounded-md bg-gray-200">
            <p className="text-gray-700">Selected Resource:</p>
            <input
                type="text"
                className="w-full bg-transparent border-none focus:outline-none font-semibold"
                placeholder="Select or type a resource..."
                value={selectedResource}
                onChange={(e) => selectedResource(e.target.value)}
                list="resource-options" // Connects input to the datalist below
            />
            {/* Datalist for auto-suggestions */}
            <datalist id="resource-options">
                <option value="Resource 1" />
                <option value="Resource 2" />
                <option value="Resource 3" />
                <option value="Custom Resource" />
            </datalist>
            </div>

          <textarea
            className="border px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          
          <button
            className="px-6 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300 w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!subject || !selectedResource || !description}
          >
            Request
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BookResources;