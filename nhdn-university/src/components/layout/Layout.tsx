import { Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar"; // Adjust the import path as needed
import TitleBar from "./TitleBar"; // Adjust the import path as needed

const Layout = () => {
  const location = useLocation();

  // Paths where the sidebar and title bar should be hidden
  const hideSidebarPaths = ["/", "/login"];

  // Check if the current path should hide the sidebar and title bar
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {shouldShowSidebar && <SideBar />}

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow">
        {/* TitleBar (only shown when sidebar is shown) */}
        {shouldShowSidebar && <TitleBar />}

        {/* Main Content */}
        <div className={`flex-grow overflow-y-auto bg-gray-100 ${shouldShowSidebar ? "" : "w-full"}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;