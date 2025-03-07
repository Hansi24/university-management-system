import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaClipboardCheck } from "react-icons/fa";
import SideBar from "../../layout/SideBar";
import TitleBar from "../../layout/TitleBar";


const Module = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const lectures = [
    { title: "Introduction to Algorithms" },
    { title: "Data Structures Overview"},
  ];

  const assignments = [
    { title: "Assignment 1 - Sorting Algorithms" },
    { title: "Assignment 2 - Linked Lists" },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <SideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="m-6">
        {/* Course Information */}
        <div className="bg-white p-4 text-lg font-semibold flex items-center  shadow-md border-l-4 border-blue-600">
          🎓 BSc in Software Engineering (2021-2024)
        </div>

        {/* Back Button */}
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-fit"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Back to Semester
        </button>

        {/* Module Title */}
        <h2 className="text-2xl font-bold mt-6 text-gray-700">📘 Module {id}</h2>

        {/* Lectures Section (Displayed as Rows) */}
        <h3 className="text-xl font-semibold mt-6 text-gray-600">📖 Lectures</h3>
        <div className="mt-4 space-y-4">
          {lectures.map((lecture, index) => (
            <div
              key={index}
              className="flex items-center bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
             
              <div className="flex items-center text-lg font-semibold">
                <FaBookOpen className="text-blue-600 mr-3" />
                {lecture.title}
              </div>
            </div>
          ))}
        </div>

        {/* Assignments Section */}
        <h3 className="text-xl font-semibold mt-6 text-gray-600">📝 Assignments</h3>
        <div className="space-y-4 mt-4">
          {assignments.map((assignment, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center text-lg font-semibold">
                <FaClipboardCheck className="text-green-600 mr-3" />
                {assignment.title}
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 accent-green-600 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Module;
