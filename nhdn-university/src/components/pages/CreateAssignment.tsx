import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";
import { useState } from "react";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState({ type: "", title: "", deadline: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Assignment Created:", assignment);
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <SideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="m-6">
          {/* Back Button */}
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-fit"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          {/* Assignment Form */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700">Create Assignment</h2>

            <div className="mt-4">
              <label className="block text-gray-600 font-semibold">Type</label>
              <select
                name="type"
                className="w-full p-2 border rounded mt-1"
                value={assignment.type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Homework">Homework</option>
                <option value="Project">Project</option>
                <option value="Exam">Exam</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-gray-600 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                className="w-full p-2 border rounded mt-1"
                value={assignment.title}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-600 font-semibold">Deadline</label>
              <input
                type="date"
                name="deadline"
                className="w-full p-2 border rounded mt-1"
                value={assignment.deadline}
                onChange={handleChange}
              />
            </div>

            <button
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
              onClick={handleSubmit}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
