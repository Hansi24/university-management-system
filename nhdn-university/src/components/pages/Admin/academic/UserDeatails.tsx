import { useState, useContext, useEffect } from "react";
import { ROLE_TYPES, StudentType } from "../../../../enums/roleEnums";
import { IUsers } from "../../../../models/RegistraionFormData";
import { CommonContext } from "../../../../context/commonContext";
import { useMessagePopup } from "../../../../context/useMessagePopup";
import { AppResponse } from "../../../../models/Response";
import { AuthService } from "../../../../service/authService";
import { CourseService } from "../../../../service/courseService";

export default function UserDetails() {
  const [users, setUsers] = useState<IUsers[]>([]);
  const [filterType, setFilterType] = useState<ROLE_TYPES>(ROLE_TYPES.STUDENT);
  const [repStudentId, setRepStudentId] = useState<string | null>(null); // Track the rep student
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showInfoMessage, showSuccessMessage } = useMessagePopup();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setSpinnerOpen(true);
    try {
      const response: AppResponse<any> = await CourseService.getAllCourse();
      if (response.success) {
        setCourses(response.data);
      } else {
        showErrorMessage(response.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      showErrorMessage("An error occurred while fetching courses.");
    } finally {
      setSpinnerOpen(false);
    }
  };

  // Fetch users based on role
  const fetchUsers = async () => {
    setUsers([])
    setSpinnerOpen(true);
    try {
      let url = `get-users/${selectedCourse}`; // Course is always required
      if (filterType === ROLE_TYPES.STUDENT) {
        if (!selectedBatch) {
          showErrorMessage("Please select a batch.");
          return;
        }
        url = `get-users/${selectedBatch}/${selectedCourse}`; // Include batch for students
      }

      const response: AppResponse<any> = await AuthService.getUsers(url);
      if (response.success) {
        if (response.data.length === 0) {
          showInfoMessage("No users found for the selected criteria.");
          return;
        }
        setUsers(response.data);

        // Find and set the rep student
        const repStudent = response.data.find((user: IUsers) => user.type === StudentType.REP);
        if (repStudent) {
          setRepStudentId(repStudent._id);
        }
      } else {
        showErrorMessage(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showErrorMessage("An error occurred while fetching users.");
    } finally {
      setSpinnerOpen(false);
    }
  };

  // Handle batch selection
  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBatch(e.target.value);
  };

  // Handle course selection
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  // Generate batch options (current year and previous two years)
  const generateBatchOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 3 }, (_, i) => currentYear - i);
  };

  // Handle semester upgrade
  const handleUpgradeSemester = async (userId: string, currentSemester: number) => {
    // Check if the current semester is already at the maximum limit
    if (currentSemester >= 4) {
      showErrorMessage("Maximum semester limit reached (4)");
      return;
    }
  
    setSpinnerOpen(true);
    try {
      const semester = currentSemester + 1;
      const response: AppResponse<any> = await AuthService.upgradeSemester(userId, semester);
      if (response.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, semester: semester } : user
          )
        );
        showSuccessMessage("Semester upgraded successfully!");
      } else {
        showErrorMessage(response.message || "Failed to upgrade semester");
      }
    } catch (error) {
      console.error("Error upgrading semester:", error);
      showErrorMessage("An error occurred while upgrading semester.");
    } finally {
      setSpinnerOpen(false);
    }
  };

  // Handle making a student as rep
  const handleMakeRep = async (userId: string) => {
    setSpinnerOpen(true);
    try {
      const response: AppResponse<any> = await AuthService.updateUserType(userId);
      if (response.success) {
        setRepStudentId(userId); // Update the rep student ID
        showSuccessMessage("Student marked as rep successfully!");
        fetchUsers(); // Refresh the user list
      } else {
        showErrorMessage(response.message || "Failed to mark as rep");
      }
    } catch (error) {
      console.error("Error marking as rep:", error);
      showErrorMessage("An error occurred while marking as rep.");
    } finally {
      setSpinnerOpen(false);
    }
  };

  // Filtered data based on role
  const filteredData = users.filter((user) => user.role === filterType);

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <div className="flex flex-col flex-grow">
        <div className="p-6 bg-gray-100 min-h-screen">
          {/* Header Sections */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Students Section */}
            <div
              className={`bg-white p-4 rounded-xl cursor-pointer shadow ${
                filterType === ROLE_TYPES.STUDENT
                  ? "border-blue-500 border-2"
                  : ""
              }`}
              onClick={() => setFilterType(ROLE_TYPES.STUDENT)}
            >
              <h2 className="text-lg font-bold text-center">Students</h2>
              {filterType === ROLE_TYPES.STUDENT && (
                <div className="flex gap-2 mt-2">
                  <select
                    className="p-2 border rounded-md w-full"
                    value={selectedBatch}
                    onChange={handleBatchChange}
                  >
                    <option value="">Select Batch</option>
                    {generateBatchOptions().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-2 border rounded-md w-full"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={fetchUsers}
                  >
                    Fetch
                  </button>
                </div>
              )}
            </div>

            {/* Lecturer Section */}
            <div
              className={`bg-white p-4 rounded-xl cursor-pointer shadow ${
                filterType === ROLE_TYPES.LECTURER
                  ? "border-green-500 border-2"
                  : ""
              }`}
              onClick={() => setFilterType(ROLE_TYPES.LECTURER)}
            >
              <h2 className="text-lg font-bold text-center">Lecturer</h2>
              {filterType === ROLE_TYPES.LECTURER && (
                <div className="flex gap-2 mt-2">
                  <select
                    className="p-2 border rounded-md w-full"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={fetchUsers}
                  >
                    Fetch
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white p-4 rounded-xl shadow">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Registration No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">
                    {filterType === ROLE_TYPES.STUDENT ? "Course" : "Profession"}
                  </th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Phone No</th>
                  {filterType === ROLE_TYPES.STUDENT && (
                    <th className="border p-2">Semester</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user) => (
                  <tr
                    key={user._id}
                    className={`text-center ${repStudentId === user._id ? "bg-yellow-200" : ""}`}
                  >
                    <td className="border p-2 relative">
                      {user.regId}
                      <button
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setOpenDropdownId(openDropdownId === user._id ? null : user._id)}
                      >
                        ▼
                      </button>
                      {openDropdownId === user._id && (
                        <div className="absolute ml-12 z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1">
                          <button
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleMakeRep(user._id)}
                          >
                            Make as Rep
                          </button>
                        </div>
                      )}
                      {repStudentId === user._id && (
                        <span className="text-yellow-700 font-bold absolute right-2 top-1/2 transform -translate-y-1/2">
                          REP
                        </span>
                      )}
                    </td>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">
                      {filterType === ROLE_TYPES.STUDENT
                        ? typeof user.courseId === "object" && user.courseId !== null
                          ? user.courseId.name
                          : user.courseId || ""
                        : user.type || ""}
                    </td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{user.phone}</td>
                    {filterType === ROLE_TYPES.STUDENT && (
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          handleUpgradeSemester(user._id, user.semester || 1)
                        }
                        className={`bg-blue-500 text-white px-2 py-1 rounded ${
                          user.semester >= 4 ? "cursor-not-allowed" : ""
                        }`}
                        disabled={user.semester >= 4} // Disable the button if semester is 4 or more
                      >
                        {user.semester < 4
                          ? `Upgrade to Semester ${user.semester ? user.semester + 1 : 1}`
                          : "Final Year"}
                      </button>
                    </td>
                  )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}