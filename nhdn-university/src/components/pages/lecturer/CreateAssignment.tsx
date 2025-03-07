import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFileUpload, FaEnvelope, FaCalendarAlt, FaEdit } from "react-icons/fa";
import SideBar from "../../layout/SideBar";
import TitleBar from "../../layout/TitleBar";
import { useState } from "react";

const CreateContent = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<{
    type: string;
    title: string;
    deadline: string;
    description: string;
    files: File[];
    email: string;
  }>({
    type: "",
    title: "",
    deadline: "",
    description: "",
    files: [],
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setContent({ ...content, files: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async () => {
    console.log("Content Created:", content);
    // Send to database & email students
    await fetch("/api/saveContent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    alert("Content posted successfully!");
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <SideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="m-6">
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-fit"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <div className=" mt-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-700 flex items-center space-x-2">
              <FaEdit className="text-blue-600" />
              <span>Create Assignment / Lecture</span>
            </h2>

            <div className="mt-4">
              <label className="block text-gray-600 font-semibold flex items-center space-x-2">
                <FaEdit />
                <span>Type</span>
              </label>
              <select
                name="type"
                className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={content.type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Assignment">Assignment</option>
                <option value="Lecture">Lecture</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-gray-600 font-semibold flex items-center space-x-2">
                <FaEdit />
                <span>Title</span>
              </label>
              <input
                type="text"
                name="title"
                className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={content.title}
                onChange={handleChange}
              />
            </div>

            {content.type === "Assignment" && (
              <>
                <div className="mt-4">
                  <label className="block text-gray-600 font-semibold flex items-center space-x-2">
                    <FaCalendarAlt />
                    <span>Deadline</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={content.deadline}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-gray-600 font-semibold flex items-center space-x-2">
                    <FaEnvelope />
                    <span>Send Mail</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email to send notification"
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="mt-4">
              <label className="block text-gray-600 font-semibold flex items-center space-x-2">
                <FaEdit />
                <span>Description</span>
              </label>
              <textarea
                name="description"
                className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                value={content.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mt-4">
              <label className="block text-gray-600 font-semibold flex items-center space-x-2">
                <FaFileUpload />
                <span>Upload Files</span>
              </label>
              <input
                type="file"
                multiple
                className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleFileChange}
              />
            </div>

            {content.files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-gray-600 font-semibold">Uploaded Files</h3>
                <ul className="list-disc pl-5">
                  {content.files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-full"
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

export default CreateContent;
