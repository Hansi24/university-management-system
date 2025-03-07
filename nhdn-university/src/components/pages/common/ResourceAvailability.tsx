import React, { useState } from "react";
import backgroundImage from '../../../assets/background.jpeg';
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SideBar from "../../layout/SideBar";
import TitleBar from "../../layout/TitleBar";

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [showResources, setShowResources] = useState(false);
  const [selectedResource, setSelectedResource] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  
  const navigate = useNavigate();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedBuilding("");
    setSelectedRoom("");
    setShowResources(false);
  };

  const handleBookResource = () => {
    if (selectedResource && !isUnavailable(selectedResource)) {
      navigate("/BookResources", {
        state: {
          selectedResource,
          date: date.toLocaleDateString(),
          time,
          duration
        }
      });
    }
};


  let filteredResources: string[] = [];
  if (selectedCategory) {
    filteredResources = resourceData[selectedCategory]?.filter((resource) =>
      resource.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }

  const isUnavailable = (resource: string) => unavailableResources.includes(resource);

  return (
    <div className="flex w-full min-h-screen bg-gray-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <SideBar />
      <div className="flex flex-col w-full">
        <TitleBar />
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Resource Availability</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Calendar
                onChange={(newDate) => setDate(newDate instanceof Date ? newDate : new Date())}
                value={date}
                minDate={new Date()}
                className="rounded-lg shadow-md w-full"
              />
              <div>
                <label className="block text-gray-600 font-semibold mb-2">Enter Time Slot</label>
                <input
                  type="time"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <label className="block text-gray-600 font-semibold mb-2 mt-4">Select Duration</label>
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
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 font-semibold mb-2">Select Category</label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Choose Category</option>
                {Object.keys(resourceData).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {date && time && (
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
                          onClick={() => setSelectedResource(resource)}
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