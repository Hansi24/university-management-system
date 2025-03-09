import { Link } from "react-router-dom";
import { Home, UserPlus, Calendar, Users, FileText, BookOpen, Clipboard, LogOut } from "lucide-react";

const ASideBar = () => {
  return (
    <div className="w-[300px] h-screen sticky top-0 bg-gray-900 text-white shadow-lg flex flex-col">
      {/* Profile Section */}
      <div className="text-center py-6 border-b border-gray-700">
        <div className="w-20 h-20 bg-gray-500 rounded-full mx-auto"></div>
        <p className="mt-3 text-xl font-semibold">Admin</p>
        <p className="text-sm text-gray-400">Academic</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow p-4">
        <ul className="space-y-3">
          <li>
            <Link to="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md">
              <Home size={20} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/Register" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md">
              <UserPlus size={20} /> Create User
            </Link>
          </li>
          <li>
            <Link to="/CourseDetails" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md">
              <Users size={20} /> Course Details
            </Link>
          </li>
          <li>
            <Link to="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md">
              <Calendar size={20} /> Time Table
            </Link>
          </li>
          <li>
            <Link to="/UserDetails" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md">
              <Users size={20} /> User Details
            </Link>
          </li>

          <li className="text-gray-400 text-sm mt-4 uppercase px-4">Resources</li>
          <li>
            <Link to="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md">
              <FileText size={20} /> Request Resources
            </Link>
          </li>
          <li>
            <Link to="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md">
              <FileText size={20} /> Requested Resources
            </Link>
          </li>

          <li className="text-gray-400 text-sm mt-4 uppercase px-4">Academic</li>
          <li>
            <Link to="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md">
              <BookOpen size={20} /> LearnLog
            </Link>
          </li>
          <li>
            <Link to="#" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded-md">
              <Clipboard size={20} /> Assignments
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <Link to="#" className="flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white">
          <LogOut size={20} /> Logout
        </Link>
      </div>
    </div>
  );
};

export default ASideBar;
