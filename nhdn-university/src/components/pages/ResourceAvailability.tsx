import React, { useState } from "react";
import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";

const resourceData: { [key: string]: string[] } = {
  Ground: ["A - Ground", "B - Ground"],
  "Lecture Hall": ["LH1", "LH2", "LH3", "LH4"],
  Auditoriums: ["Main Auditorium", "Mini Auditorium"],
  "Electric Equipment": ["Projector", "Microphone", "Speakers"],
  Vehicles: ["Bus 1", "Van 2", "Truck 3"],
  Others: ["Library Room", "Sports Hall"],
};

const ResourceAvailability: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Ground");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredResources = resourceData[selectedCategory].filter((resource) =>
    resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex flex-col w-full">
        <TitleBar />
      <div className="flex flex-1">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg m-6 overflow-y-auto">
          <div className="flex justify-between gap-5 mb-4">
            <select
              className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.keys(resourceData).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Resources List */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                {filteredResources.map((resource, index) => (
                  <tr key={index} className="border-b hover:bg-blue-100">
                    <td className="p-3 font-semibold">{resource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Button */}
          <div className="flex justify-center mt-4">
            <button className="text-blue-500 hover:text-blue-700 text-4xl">+</button>
          </div>
        </div>
      </div>
      </div>

    </div>
  );
};

export default ResourceAvailability;
