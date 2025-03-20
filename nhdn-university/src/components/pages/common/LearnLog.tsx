import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaGraduationCap, FaTasks } from "react-icons/fa";
import { AuthService } from "../../../service/authService";
import { AppResponse } from '../../../models/Response';
import { IUsers } from "../../../models/RegistraionFormData";
import { ROLE_TYPES } from "../../../enums/roleEnums";
import { ModuleService } from "../../../service/moduleService";

const LearnLog = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUsers>();
  const [latestAssignments, setLatestAssignments] = useState<{ title: string; dueDate: string }[]>([]);
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

  // Fetch latest assignments for the user (if student)
  useEffect(() => {
    const fetchLatestAssignments = async () => {
      if (userId && user?.role === ROLE_TYPES.STUDENT) {
        try {
          const assignments:AppResponse<{ title: string; dueDate: string }[]> = await ModuleService.getLatestAssignmentsForUser();
          if (assignments.success) {
            setLatestAssignments(assignments.data);
          }
        } catch (error) {
          console.error("Error fetching latest assignments:", error);
        }
      }
    };

    fetchLatestAssignments();
  }, [userId, user]);

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
    <div className="flex w-full h-[682px] bg-gradient-to-r from-blue-100 to-gray-100">
      <div className="flex flex-col flex-grow p-6">
        
        {/* Course Name */}
        {user && user.courseId && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center">
              <FaGraduationCap className="text-2xl text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">
                {typeof user.courseId === "object" ? user.courseId.name : user.courseId} ({user.batch})
              </h2>
            </div>
          </div>
        )}
        {/* Notice Board Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <FaTasks className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Notice Board</h2>
          </div>
          {user?.role === ROLE_TYPES.STUDENT ? (
            latestAssignments.length > 0 ? (
              <div className="space-y-4">
                {latestAssignments.map((assignment, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">
                      Due Date: {new Date(assignment.dueDate).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No assignments found.</p>
            )
          ) : (
            <p className="text-gray-600">Welcome to the Notice Board! Here you can find important announcements and updates.</p>
          )}
        </div>


        {/* Semester Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {generateSemesters().map((sem, index) => (
            <button
              key={index}
              className="bg-white p-6 flex flex-col items-center justify-center rounded-lg shadow-lg hover:bg-blue-100 transition-all duration-300"
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