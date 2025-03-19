import { Link, useLocation } from "react-router-dom";
import {
  Home,
  UserPlus,
  Calendar,
  Users,
  FileText,
  BookOpen,
  Clipboard,
  LogOut,
} from "lucide-react";
import {
  ROLE_TYPES,
  StudentType,
  LecturerType,
  AdminType,
} from "../../enums/roleEnums";
import { useEffect, useState } from "react";
import { useTokenContext } from "../../context/TokenContext";
import { IUsers } from "../../models/RegistraionFormData";
import { AuthService } from "../../service/authService";
import { AppResponse } from "../../models/Response";

const SideBar = () => {
  const { clearToken } = useTokenContext();
  const [userDetails, setUserDetails] = useState<IUsers | null>(null);
  const location = useLocation();
  
    // Paths where the sidebar and title bar should be hidden
  const hideSidebarPaths = ["/TimeTable"];
  
    // Check if the current path should hide the sidebar and title bar
    const shouldShowSidebar25Percentage = !hideSidebarPaths.includes(location.pathname);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response: AppResponse<IUsers> =
          await AuthService.getUserDetails();
        if (response.success) {
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    clearToken();
  };

  const role = localStorage.getItem("UserRole");
  const type = localStorage.getItem("userType");

  return (
    <div className={`${shouldShowSidebar25Percentage ? "w-[15%]" : "w-[30%]"} h-screen sticky top-0 bg-gray-900 text-white shadow-lg flex flex-col`}>
      {/* Profile Section */}
      <div className="text-center py-6 border-b border-gray-700">
        <div
          className="w-20 h-20 bg-gray-500 rounded-full mx-auto"
          style={{
            backgroundImage:
              typeof userDetails?.profilePic === "string"
                ? `url(${userDetails.profilePic})`
                : undefined,
            backgroundSize: "cover", // Ensures the image covers the entire div
            backgroundPosition: "center", // Centers the image
          }}
        ></div>
        <p className="mt-3 text-xl font-semibold">{userDetails?.name}</p>
        <p className="text-sm text-gray-400">{userDetails?.regId}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow p-4">
        <ul className="space-y-3">
          {/* Admin Routes */}
          {role === ROLE_TYPES.ADMIN && (
            <>
              <li>
                <Link
                  to="/admin-dashboard"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                >
                  <Home size={20} /> Dashboard
                </Link>
              </li>
              {type === AdminType.ACADEMIC && (
                <>
                  <li>
                    <Link
                      to="/CourseDetails"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                    >
                      <Users size={20} /> Course Details
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/Register"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                    >
                      <Users size={20} /> New User
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/UserDetails"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                    >
                      <Users size={20} /> User Details
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/TimeTable"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                    >
                      <Users size={20} /> TimTable
                    </Link>
                  </li>
                </>
              )}
              {type === AdminType.RESOURCE && (
                <>
                  <li>
                  <Link
                    to="/ResourceManagement"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                  >
                    <FileText size={20} /> Resource
                  </Link>
                    <Link
                      to="/ResourceAvailability"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                    >
                      <FileText size={20} /> Resource Availability
                  </Link>
                  <Link
                    to="/ManageResource"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                  >
                    <FileText size={20} /> Manage Resource
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/CreateResource"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                    >
                      <FileText size={20} /> New Resource
                    </Link>
                  </li>
                </>
              )}
              {type === AdminType.EVENT && (
                <Link
                  to="/CreatePost"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                >
                  <UserPlus size={20} /> Create Post
                </Link>
              )}
            </>
          )}

          {/* Lecturer and Student Routes */}
          {(role === ROLE_TYPES.LECTURER || role === ROLE_TYPES.STUDENT) && (
            <>
              <li>
                <Link
                  to="/event-dashboard"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                >
                  <Home size={20} /> Dashboard
                </Link>
              </li>
              {(role === ROLE_TYPES.LECTURER ||
                (role === ROLE_TYPES.STUDENT && type === StudentType.REP)) && (
                <li>
                  <Link
                    to="/CreatePost"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                  >
                    <UserPlus size={20} /> Create Post
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/TimeTable"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                >
                  <Calendar size={20} /> Time Table
                </Link>
              </li>
              {(role === ROLE_TYPES.LECTURER ||
                (role === ROLE_TYPES.STUDENT && type === StudentType.REP)) && (
                <li>
                  <Link
                    to="/ResourceAvailability"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                  >
                    <FileText size={20} /> Book Resource
                  </Link>
                  <Link
                    to="/BookResources"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                  >
                    <FileText size={20} /> Requested Resources
                  </Link>

                </li>
              )}
              <li>
                <Link
                  to="/Learnlog"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                >
                  <BookOpen size={20} /> LearnLog
                </Link>
              </li>
              {role === ROLE_TYPES.STUDENT && (
                <li>
                  <Link
                    to="/EnrollSem"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md"
                  >
                    <Clipboard size={20} /> Enroll
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/login"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white"
        >
          <LogOut size={20} /> Logout
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
