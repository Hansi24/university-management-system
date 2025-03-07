import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import TitleBar from "../../../layout/TitleBar";
import ASideBar from "../ASideBar";

interface Module {
  name: string;
  code: string;
}

interface Semester {
  semesterNumber: number;
  modules: Module[];
}

interface Course {
  name: string;
  code: string;
  semesters: Semester[];
}

export default function CourseDetails() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Course>({
    name: "",
    code: "",
    semesters: Array.from({ length: 4 }, (_, i) => ({ semesterNumber: i + 1, modules: [] })),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState<number | null>(null);
  const [moduleInputs, setModuleInputs] = useState<Module[]>([]);

  const handleOpenModal = (semesterIndex: number) => {
    setCurrentSemesterIndex(semesterIndex);
    const existingModules = [...newCourse.semesters[semesterIndex].modules];
    setModuleInputs(existingModules.length > 0 ? existingModules : [{ name: "", code: "" }]);
    setIsModalOpen(true);
  };

  const handleAddModuleInput = () => {
    setModuleInputs([...moduleInputs, { name: "", code: "" }]);
  };

  const handleRemoveModuleInput = (index: number) => {
    if (moduleInputs.length > 1) {
      const updatedModules = moduleInputs.filter((_, i) => i !== index);
      setModuleInputs(updatedModules);
    }
  };

  const handleModuleChange = (index: number, field: keyof Module, value: string) => {
    const updatedModules = [...moduleInputs];
    updatedModules[index][field] = value;
    setModuleInputs(updatedModules);
  };

  const handleSaveModules = () => {
    if (currentSemesterIndex === null) return;
    const updatedSemesters = [...newCourse.semesters];
    updatedSemesters[currentSemesterIndex].modules = [...moduleInputs];
    setNewCourse({ ...newCourse, semesters: updatedSemesters });
    setIsModalOpen(false);
  };

  const handleCreateCourse = () => {
    if (newCourse.name && newCourse.code) {
      setCourses([...courses, newCourse]);
      setNewCourse({
        name: "",
        code: "",
        semesters: Array.from({ length: 4 }, (_, i) => ({ semesterNumber: i + 1, modules: [] })),
      });
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <ASideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold mb-4">University Courses</h2>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold">Create Course</h3>
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              className="p-2 border rounded-md w-full mt-2"
            />
            <input
              type="text"
              placeholder="Course Code"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              className="p-2 border rounded-md w-full mt-2"
            />
            {newCourse.semesters.map((semester, index) => (
              <div key={index} className="mt-4 p-2 border rounded-md bg-gray-50">
                <h4 className="font-semibold">Semester {semester.semesterNumber}</h4>
                <button
                  onClick={() => handleOpenModal(index)}
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md"
                >
                  Add Module
                </button>
                <ul className="mt-2">
                  {semester.modules.map((mod, modIndex) => (
                    <li key={modIndex} className="text-gray-700">{mod.name} ({mod.code})</li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={handleCreateCourse}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md"
            >
              Create Course
            </button>
          </div>
        </div>
      </div>

      {/* Custom Tailwind Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Add Modules</h3>
            {moduleInputs.map((mod, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Module Code"
                  value={mod.code}
                  onChange={(e) => handleModuleChange(index, "code", e.target.value)}
                  className="p-2 border rounded-md flex-1"
                />
                <input
                  type="text"
                  placeholder="Module Name"
                  value={mod.name}
                  onChange={(e) => handleModuleChange(index, "name", e.target.value)}
                  className="p-2 border rounded-md flex-1"
                />
                <button onClick={handleAddModuleInput} className="p-2 bg-blue-500 text-white rounded-md">
                  <FaPlus />
                </button>
                {moduleInputs.length > 1 && (
                  <button onClick={() => handleRemoveModuleInput(index)} className="p-2 bg-red-500 text-white rounded-md">
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button onClick={handleSaveModules} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md">
              Add
            </button>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md ml-2">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}