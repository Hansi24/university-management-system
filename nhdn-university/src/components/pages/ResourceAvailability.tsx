import React, { useState } from "react";
import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";
import backgroundImage from '../../assets/background.jpeg';
import { useNavigate } from "react-router-dom";

const resourceData: { [key: string]: string[] } = {
  Ground: ["A - Ground", "B - Ground"],
  "Lecture Hall": ["Building 1", "Building 2"],
  Auditoriums: ["Main Auditorium", "Mini Auditorium"],
  "Electric Equipment": ["Projector", "Microphone", "Speakers"],
  Vehicles: ["Bus 1", "Van 2", "Truck 3"],
  Others: ["Library Room", "Sports Hall"],
};

const unavailableResources = ["LH2", "Projector", "Bus 1"]; 

const ResourceAvailability: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("30"); 
  const [showResources, setShowResources] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<string>(""); 
  const [bookingStatus, setBookingStatus] = useState<string>(""); 
  const [newResource, setNewResource] = useState<string>(""); 

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedBuilding("");
    setSelectedRoom("");
    setShowResources(false);
  };

  const navigate = useNavigate();

  const handleBookResource = () => {
    if (selectedResource && !isUnavailable(selectedResource)) {
      navigate("/BookResources", { state: { selectedResource } }); 
    }
  };

  // Get filtered resources
  let filteredResources: string[] = [];
  if (selectedCategory) {
    filteredResources = resourceData[selectedCategory]?.filter((resource) =>
      resource.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }

  // Check if a resource is unavailable
  const isUnavailable = (resource: string) => unavailableResources.includes(resource);

  return (
    <div className="flex w-full min-h-screen bg-gray-100" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <SideBar />
      <div className="flex flex-col w-full">
        <TitleBar />
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Resource Availability</h2>

            {/* Date & Time Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                type="date"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type="time"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            {/* Duration Selection */}
            <div className="mb-6">
              <label className="block text-gray-600 font-semibold mb-2">Select Duration</label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="90">1 Hour 30 Minutes</option>
                <option value="120">2 Hours</option>
              </select>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-gray-600 font-semibold mb-2">Select Category</label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Choose Category</option>
                {Object.keys(resourceData).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Lecture Hall Selection */}
            {selectedCategory === "Lecture Hall" && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <select
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                >
                  <option value="">Select Building</option>
                  {resourceData["Lecture Hall"].map((building) => (
                    <option key={building} value={building}>
                      {building}
                    </option>
                  ))}
                </select>

                {selectedBuilding && (
                  <select
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedRoom}
                    onChange={(e) => {
                      setSelectedRoom(e.target.value);
                      setShowResources(true);
                    }}
                  >
                    <option value="">Select Floor</option>
                    {["F1", "F2", "F3", "F4"].map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Show Resources after Date & Time are Selected */}
            {date && time && (showResources || selectedCategory !== "Lecture Hall") ? (
              <div className="border rounded-lg overflow-hidden shadow-md">
                <table className="w-full border-collapse">
                  <tbody>
                    {filteredResources.map((resource, index) => (
                      <tr
                        key={index}
                        className={`border-b ${isUnavailable(resource) ? "bg-red-500 text-white font-bold" : "hover:bg-green-200"}`}
                      >
                        <td
                          className="p-3 text-lg cursor-pointer flex items-center"
                          onClick={() => setSelectedResource(resource)}  // Set selected resource
                        >
                          {selectedResource === resource && (
                            <span className="mr-2 text-green-500">&#10003;</span>
                          )}
                          {resource}
                        </td>
                        {isUnavailable(resource) && <td className="text-red-500">Unavailable</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 mt-4 text-center">
                Please select a date and time before checking availability.
              </p>
            )}

          {/* Book Resource Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleBookResource}
              className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-6 rounded-full shadow-lg transition-all duration-300"
              disabled={!selectedResource || isUnavailable(selectedResource)}
            >
              Book Resource
            </button>
          </div>

          {/* Booking Status Message */}
          {bookingStatus && (
            <div className="mt-4 text-center text-lg font-semibold">
              {bookingStatus}
            </div>
      )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAvailability;