import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaBook } from "react-icons/fa";
import { AuthService } from "../../../service/authService";
import { AppResponse } from "../../../models/Response";
import { CourseService } from "../../../service/courseService";
import { IUsers } from "../../../models/RegistraionFormData";
import { ROLE_TYPES } from "../../../enums/roleEnums";

const Semester = () => {
  const { id: semesterId } = useParams(); // semesterId from URL
  const location = useLocation();
  const { courseId } = location.state; // courseId passed from LearnLog
  const navigate = useNavigate();
  const [modules, setModules] = useState<any[]>([]);
  const [enrolledModules, setEnrolledModules] = useState<any[]>([]);
  const [teachingModules, setTeachingModules] = useState<any[]>([]); // Store teaching modules for lecturers
  const [role, setRole] = useState<string>(""); // To handle role of user (student/lecturer)
  const userId = localStorage.getItem("userId");
  console.log(semesterId, courseId, userId);

  // Fetch student/lecturer data and modules for the selected semester and enrolled modules
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user role (either student or lecturer) to customize the behavior
        if (userId) {
          const userResponse: AppResponse<any> = await AuthService.getStudentDetails(userId);
          if (userResponse.success) {
            setRole(userResponse.data.role); // Set role (student/lecturer)
            // If the user is a student, fetch the enrolled modules
            if (userResponse.data.role === ROLE_TYPES.STUDENT) {
              setEnrolledModules(userResponse.data.enrolledModules);
            } else if (userResponse.data.role === ROLE_TYPES.LECTURER) {
              // Fetch teaching modules for lecturer
              setTeachingModules(userResponse.data.teachingModules); // Assuming the response includes teaching modules
            }
          }
        }

        // Fetch modules for the selected semester based on courseId and semesterId
        const semesterResponse: AppResponse<any> = await CourseService.getSemesterModules(courseId, Number(semesterId));
        if (semesterResponse.success) {
          setModules(semesterResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [courseId, semesterId, userId]);

  // Check if a module is enrolled by a student
  const isModuleEnrolled = (moduleId: string) => {
    return enrolledModules.some(
      (mod) => mod.moduleId === moduleId
    );
  };

  // Check if a lecturer is teaching this module
  const isLecturerTeachingModule = (moduleId: string) => {
    console.log(teachingModules, moduleId);
    return teachingModules.includes(moduleId); // Check if the module is in the lecturer's teaching list
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <div className="flex flex-col flex-grow p-6">
        {/* Back Button */}
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-fit"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Back to Semesters
        </button>

        {/* Semester Title */}
        <h2 className="text-2xl font-bold mt-6 text-gray-700">📚 Semester {semesterId}</h2>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {modules.map((mod, index) => (
            <button
              key={index}
              className={`bg-white p-4 rounded-lg shadow-lg flex flex-col items-center border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                (role === ROLE_TYPES.STUDENT && !isModuleEnrolled(mod._id)) || 
                (role === ROLE_TYPES.LECTURER && !isLecturerTeachingModule(mod._id)) 
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => {
                if (role === ROLE_TYPES.STUDENT && isModuleEnrolled(mod._id)) {
                  navigate(`/module/${mod._id}`); // Navigate to module detail page for student
                } else if (role === ROLE_TYPES.LECTURER && isLecturerTeachingModule(mod._id)) {
                  navigate(`/module/${mod._id}`); // Navigate to module detail page for lecturer
                }
              }}
            >
              <div className="flex items-center mt-3 text-lg font-semibold">
                <FaBook className="text-blue-600 mr-2" />
                {mod.name}
              </div>
              {(role === ROLE_TYPES.STUDENT && !isModuleEnrolled(mod._id)) && (
                <span className="text-sm text-red-600 mt-2">Not Enrolled</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Semester;
