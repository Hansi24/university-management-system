import { useNavigate } from "react-router-dom";
import { FaBook, FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";

const LearnLog = () => {
  const navigate = useNavigate();
  const semesters = [
    { name: "Semester 1", icon: <FaBook /> },
    { name: "Semester 2", icon: <FaBook /> },
    { name: "Semester 3", icon: <FaBook /> },
    { name: "Semester 4", icon: <FaBook /> },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-100 to-gray-100">
      <SideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="bg-gray-300 mx-6 mt-3 p-6 text-lg font-bold rounded-md shadow-md">
          Notice Board
        </div>
        <div className="bg-gray-300 mx-6 mt-3 p-6  flex items-center rounded-md shadow-md text-lg font-semibold">
          <FaGraduationCap className="mr-3 text-blue-700" /> BSc in Software Engineering (2021-2024)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 mt-2">
          {semesters.map((sem, index) => (
            <button
              key={index}
              className="bg-white p-6 flex flex-col items-center justify-center rounded-lg shadow-lg hover:bg-blue-200 transition-all duration-300"
              onClick={() => navigate(`/semester/${index + 1}`)}
            >
              <div className="text-3xl text-blue-600 mb-2">{sem.icon}</div>
              <span className="cursor-default text-lg font-semibold">{sem.name}</span>
            </button>
          ))}
          <button className="bg-white p-6 flex flex-col items-center justify-center rounded-lg shadow-lg hover:bg-blue-200 transition-all duration-300">
            <FaChalkboardTeacher className="text-3xl text-blue-600 mb-2" />
            <span className="text-lg font-semibold">Exams</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnLog;
