import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaGraduationCap } from "react-icons/fa";
import { AuthService } from "../../../service/authService";
import { AppResponse } from "../../../models/Response";
import { IUsers } from "../../../models/RegistraionFormData";
import { ROLE_TYPES } from "../../../enums/roleEnums";

const LearnLog = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUsers>();
  const userId = localStorage.getItem("userId");

  // Fetch user details (both student & lecturer)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (userId) {
          const response: AppResponse<any> = await AuthService.getStudentDetails(userId);
          if (response.success) {
            setUser(response.data);
          }
        } else {
          console.error("User ID is null");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  // Helper function to get teaching semesters for lecturers
  const getTeachingSemesters = () => {
    if (!user || !user.courseId || !user.teachingModules) return [];
    
    const semesters = typeof user.courseId === "object" ? user.courseId.semesters : [];
    const teachingModulesSet = new Set(user.teachingModules.map(module => typeof module === "object" ? module._id : module));

    // Find semesters that contain the lecturer's teaching modules
    return semesters
      .filter(semester => semester.modules.some(module => teachingModulesSet.has(module._id)))
      .map(semester => ({
        name: `Semester ${semester.semesterNumber}`,
        id: semester.semesterNumber,
      }));
  };

  // Generate semesters dynamically
  const generateSemesters = () => {
    if (!user) return [];

    if (user.role === ROLE_TYPES.STUDENT) {
      // Student: Show all semesters up to current semester
      return Array.from({ length: user.semester }, (_, i) => ({
        name: `Semester ${i + 1}`,
        id: i + 1,
      }));
    } else if (user.role === ROLE_TYPES.LECTURER) {
      // Lecturer: Show only semesters they are teaching
      return getTeachingSemesters();
    }

    return [];
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-100 to-gray-100">
      <div className="flex flex-col flex-grow">
        <div className="bg-gray-300 mx-6 mt-3 p-6 text-lg font-bold rounded-md shadow-md">
          Notice Board
        </div>

        {/* Course Name */}
        {user && user.courseId && (
          <div className="bg-gray-300 mx-6 mt-3 p-6 flex items-center rounded-md shadow-md text-lg font-semibold">
            <FaGraduationCap className="mr-3 text-blue-700" />
            {typeof user.courseId === "object" ? user.courseId.name : user.courseId} ({user.batch})
          </div>
        )}

        {/* Semester Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 mt-2">
          {generateSemesters().map((sem, index) => (
            <button
              key={index}
              className="bg-white p-6 flex flex-col items-center justify-center rounded-lg shadow-lg hover:bg-blue-200 transition-all duration-300"
              onClick={() =>
                navigate(`/semester/${sem.id}`, {
                  state: { courseId: typeof user?.courseId === "object" ? user.courseId._id : undefined },
                })
              }
            >
              <div className="text-3xl text-blue-600 mb-2">
                <FaBook />
              </div>
              <span className="cursor-default text-lg font-semibold">{sem.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnLog;
