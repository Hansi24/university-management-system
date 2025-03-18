// EnrollSem.tsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaGraduationCap } from "react-icons/fa";
import { AuthService } from "../../../service/authService";
import { CourseService } from '../../../service/courseService';
import { IUsers } from "../../../models/RegistraionFormData";
import { CommonContext } from "../../../context/commonContext";
import { useMessagePopup } from "../../../context/useMessagePopup";

const EnrollSem = () => {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState<any[]>([]);
  const [enrolledModules, setEnrolledModules] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [student, setStudent] = useState<IUsers>();
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();

  const userId = localStorage.getItem("userId");

  // Fetch user details (including courseId, enrolledModules, and semester)
  useEffect(() => {
    const fetchData = async () => {
      setSpinnerOpen(true);
      setLoading(true);
      setError(null); // Reset error state
      try {
        if (userId) {
          const response = await AuthService.getStudentDetails(userId);
          if (response.success) {
            const { courseId, enrolledModules } = response.data;
            setCourseId(courseId?._id || courseId);
            setStudent(response.data);
            setEnrolledModules(enrolledModules.map((mod: any) => mod.moduleId?._id || mod.moduleId));

            // Fetch semesters and modules from the backend
            const semesterResponse = await CourseService.getSemestersAndModules(
              courseId?._id || courseId,
              userId
            );
            if (semesterResponse.success) {
              setSemesters(semesterResponse.data);
            }
          } else {
            setError("Failed to fetch user details");
          }
        } else {
          setError("User ID is null");
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError("Failed to fetch data");
      } finally {
        setSpinnerOpen(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Handle enroll button click
  const handleEnroll = async (moduleId: string, moduleName:string) => {
    try {
      if (student && student.courseId) {
        const response = await CourseService.enrollModule(
          typeof student.courseId === 'string' ? student.courseId : student.courseId._id,
          moduleId
        );
        if (response.success) {
          setEnrolledModules([...enrolledModules, moduleId]);
          showSuccessMessage(`You have enrolled in: ${moduleName}`);
        } else {
          showErrorMessage(`Failed to enroll in: ${moduleName}`);
        }
      } else {
        showErrorMessage("Student or course ID is undefined");
      }
    } catch (error) {
      console.error("Error enrolling in module:", error);
      showErrorMessage("An error occurred while enrolling in the module");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <div className="flex flex-col flex-grow p-6">
        {/* Program Information */}
        <div className="bg-white p-4 text-lg font-semibold flex items-center shadow-md border-l-4 border-blue-600">
          <FaGraduationCap className="mr-3 text-blue-700" /> 
          {student && (typeof student.courseId === 'object' ? student.courseId.name : student.courseId)} ({student?.batch})
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 p-4 rounded-lg text-red-600 mb-4">
            {error}
          </div>
        )}

        {/* Semesters and Modules */}
        <div className="mt-6">
          {semesters.map((semester, semIndex) => (
            <div key={semIndex} className="mb-10">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{semester.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {semester.modules.map((mod: any, modIndex: number) => (
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
                    {!enrolledModules.includes(mod._id) && (
                      <button
                        onClick={() => handleEnroll(mod._id , mod.name)}
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