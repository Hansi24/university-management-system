import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";

const EnrollSem = () => {
  const navigate = useNavigate();

  const semesters = [
    {
      name: "Semester 1",
      modules: [
        { name: "Mathematics and Statistics", code: "MATH101", gpa: 3.0 },
        { name: "English Language Skills Enhancement I", code: "ENG101", gpa: 3.5 },
        { name: "Sports Studies", code: "SPORT101", gpa: 2.5 },
        { name: "Applied Science for IT", code: "SCI101", gpa: 3.2 },
        { name: "Database Management", code: "DB101", gpa: 3.8 },
      ],
    },
    {
      name: "Semester 2",
      modules: [
        { name: "English Language Skills Enhancement II", code: "ENG102", gpa: 3.6 },
        { name: "Mathematical Methods", code: "MATH102", gpa: 3.1 },
        { name: "Computer Networks", code: "NET101", gpa: 3.4 },
        { name: "Digital Electronics", code: "ELEC101", gpa: 3.3 },
        { name: "Fundamentals of Software Engineering", code: "SE101", gpa: 3.7 },
      ],
    },
    {
      name: "Semester 3",
      modules: [
        { name: "Operating Systems", code: "OS101", gpa: 3.5 },
        { name: "Object-Oriented Programming", code: "OOP101", gpa: 3.8 },
        { name: "Web Technologies", code: "WEB101", gpa: 3.6 },
        { name: "Software Engineering Principles", code: "SE102", gpa: 3.7 },
        { name: "Cyber Security Fundamentals", code: "CYBER101", gpa: 3.4 },
      ],
    },
    {
      name: "Semester 4",
      modules: [
        { name: "Artificial Intelligence", code: "AI101", gpa: 3.9 },
        { name: "Cloud Computing", code: "CLOUD101", gpa: 3.8 },
        { name: "Mobile Application Development", code: "MOBILE101", gpa: 3.7 },
        { name: "Data Science", code: "DS101", gpa: 3.9 },
        { name: "Advanced Database Systems", code: "ADB101", gpa: 3.8 },
      ],
    },
  ];

  // State to track enrolled modules
  const [enrolledModules, setEnrolledModules] = useState<string[]>([]);

  // Handle enroll button click
  const handleEnroll = (module: string) => {
    if (!enrolledModules.includes(module)) {
      setEnrolledModules([...enrolledModules, module]);
      alert(`You have enrolled in: ${module}`);
    } else {
      alert(`You are already enrolled in: ${module}`);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <SideBar />
      <div className="flex flex-col flex-grow p-6">
        <TitleBar />

        {/* Program Information */}
        <div className="bg-white p-4 text-lg font-semibold flex items-center shadow-md border-l-4 border-blue-600">
          🎓 BSc in Software Engineering (2021-2024)
        </div>

        {/* Semesters and Modules */}
        <div className="mt-6">
          {semesters.map((semester, semIndex) => (
            <div key={semIndex} className="mb-10">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{semester.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {semester.modules.map((mod, modIndex) => (
                  <div
                    key={modIndex}
                    className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div>
                      <span className="text-lg font-medium flex items-center">
                        <FaBook className="text-blue-600 mr-2" />
                        {mod.name}
                      </span>
                      <p className="text-sm text-gray-600">Code: {mod.code}</p>
                      <p className="text-sm text-gray-600">GPA: {mod.gpa}</p>
                    </div>
                    {!enrolledModules.includes(mod.name) && (
                      <button
                        onClick={() => handleEnroll(mod.name)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnrollSem;