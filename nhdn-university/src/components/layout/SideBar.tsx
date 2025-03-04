import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="w-[250px] h-screen bg-gray-900 text-white shadow-md flex flex-col">
      {/* Profile Section */}
      <div className="text-center py-6 border-b border-gray-700">
        <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto"></div>
        <p className="mt-3 font-semibold">S.H.H. Sewwandi</p>
        <p className="text-sm text-gray-400">E123122</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/EventBoard" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/CreatePost" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Create Post
            </Link>
          </li>
          <li>
            <Link to="/TimeTable" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Time Table
            </Link>
          </li>

          <li className="text-gray-400 text-sm mt-4 uppercase">Resources</li>
          <li>
            <Link to="/ResourceAvailability" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Request Resources
            </Link>
          </li>
          <li>
            <Link to="/BookResources" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Booked Resources
            </Link>
          </li>

          <li className="text-gray-400 text-sm mt-4 uppercase">Academic</li>
          <li>
            <Link to="#" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Exam
            </Link>
          </li>
          <li>
            <Link to="#" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Assignments
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
