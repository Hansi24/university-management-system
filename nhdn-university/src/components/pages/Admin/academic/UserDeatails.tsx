import { useState } from "react";
import TitleBar from "../../../layout/TitleBar";
import ASideBar from "../ASideBar";

const studentsData = [
  { id: "E202501", name: "John Doe", course: "Computer Science", email: "john@example.com", phone: "1234567890", batch: "2023" },
  { id: "E202502", name: "Jane Smith", course: "Engineering", email: "jane@example.com", phone: "0987654321", batch: "2023" },
  { id: "E202503", name: "Alice Brown", course: "Business", email: "alice@example.com", phone: "1122334455", batch: "2023" },
];

const lecturersData = [
  { id: "L101", name: "Dr. Robert", profession: "Professor", course: "Computer Science", module: "AI" },
  { id: "L102", name: "Dr. Emily", profession: "Associate Professor", course: "Engineering", module: "Robotics" },
];

export default function UserDetails() {
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [filterType, setFilterType] = useState("students");
  const [selectedRep, setSelectedRep] = useState("");

  const handleRepSelection = (id: string) => {
    setSelectedRep(id);
  };

  const filteredData = filterType === "students" ? studentsData : lecturersData;

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <ASideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="p-6 bg-gray-100 min-h-screen">
          {/* Header Sections */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`bg-white p-4 rounded-xl shadow ${filterType === "students" ? "border-blue-500 border-2" : ""}`}>
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
                    checked={filterType === "students"}
                    onChange={() => setFilterType("students")}
                    className="toggle-checkbox"
                  />
                  Show Students
                </label>
              </div>
            </div>

            <div className={`bg-white p-4 rounded-xl shadow ${filterType === "lecturers" ? "border-green-500 border-2" : ""}`}>
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
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filterType === "lecturers"}
                    onChange={() => setFilterType("lecturers")}
                    className="toggle-checkbox"
                  />
                  Show Lecturers
                </label>
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
                </tr>
              </thead>
              <tbody>
                {filteredData.map((person) => (
                  <tr key={person.id} className="text-center">
                    <td className={`border p-2 relative ${selectedRep === person.id ? "bg-yellow-200" : ""}`}>
                      <select
                        className="w-full border-none bg-transparent"
                        onChange={() => handleRepSelection(person.id)}
                        disabled={selectedRep !== "" && selectedRep !== person.id}
                      >
                        <option value="">{person.id}</option>
                        <option value="rep">Make as Rep</option>
                      </select>
                      {selectedRep === person.id && <span className="text-yellow-700 font-bold">REP</span>}
                    </td>
                    <td className="border p-2">{person.name}</td>
                    <td className="border p-2">{'profession' in person ? person.profession : person.course}</td>
                    <td className="border p-2">{'email' in person ? person.email : person.module}</td>
                    <td className="border p-2">{'phone' in person ? person.phone : "N/A"}</td>
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