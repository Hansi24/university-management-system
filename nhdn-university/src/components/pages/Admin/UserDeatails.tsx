import { useState } from "react";
import TitleBar from "../../layout/TitleBar";
import ASideBar from "./ASideBar";

export default function UserDetails() {
  const [searchEnabled, setSearchEnabled] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <ASideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Sections */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-bold text-center">Students</h2>
          <div className="flex gap-2 mt-2">
            <select className="p-2 border rounded-md w-full">
              <option>Batch</option>
            </select>
            <select className="p-2 border rounded-md w-full">
              <option>Course</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={searchEnabled}
                onChange={() => setSearchEnabled(!searchEnabled)}
                className="toggle-checkbox"
              />
              Search
            </label>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-bold text-center">Lecturer</h2>
          <div className="flex gap-2 mt-2">
            <select className="p-2 border rounded-md w-full">
              <option>Profession</option>
            </select>
            <select className="p-2 border rounded-md w-full">
              <option>Course</option>
            </select>
            <select className="p-2 border rounded-md w-full">
              <option>Module</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Registration No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone No</th>
              <th className="border p-2">Phone No</th>
            </tr>
          </thead>
          <tbody>
            {["E202501", "E202501", "E202501"].map((id, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2 relative">
                  <select className="w-full border-none bg-transparent">
                    <option>{id}</option>
                    <option>Make as Rep</option>
                  </select>
                </td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
}
