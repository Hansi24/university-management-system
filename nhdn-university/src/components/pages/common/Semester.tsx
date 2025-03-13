import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBook } from "react-icons/fa";
import mathematicsInComputing from "../../../assets/mathematics_in_computing.jpeg"; 
import dataStructureAlgorithm from "../../../assets/data structure algorithm.jpeg";
import databaseManagement from "../../../assets/databaseManagement.webp";  
import softwareEngineering from "../../../assets/softwareEngineering.jpeg";
import SideBar from "../../layout/SideBar";
import TitleBar from "../../layout/TitleBar";

const Semester = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const modules = [
    { name: "Mathematics for Computing", image:mathematicsInComputing },
    { name: "Data Structures & Algorithms", image: dataStructureAlgorithm },
    { name: "Database Management", image: databaseManagement },
    { name: "Software Engineering", image: softwareEngineering },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <SideBar />
      <div className="flex flex-col flex-grow p-6">
        <TitleBar />

        {/* Program Information */}
        <div className="bg-white p-4 text-lg font-semibold flex items-center  shadow-md border-l-4 border-blue-600">
          🎓 BSc in Software Engineering (2021-2024)
        </div>

        {/* Back Button */}
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-fit"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Back to Semesters
        </button>

        {/* Semester Title */}
        <h2 className="text-2xl font-bold mt-6 text-gray-700">📚 Semester {id}</h2>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {modules.map((mod, index) => (
            <button
              key={index}
              className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={() => navigate(`/module/${index + 1}`)}
            >
              <img
                src={mod.image}
                alt={mod.name}
                className="w-full h-32 object-cover rounded-md"
              />
              <div className="flex items-center mt-3 text-lg font-semibold">
                <FaBook className="text-blue-600 mr-2" />
                {mod.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Semester;