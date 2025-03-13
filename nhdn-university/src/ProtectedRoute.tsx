import { Navigate, Outlet } from "react-router-dom";
import { ROLE_TYPES, USER_TYPES } from "./enums/roleEnums";

interface ProtectedRouteProps {
  allowedRoles: {
    [key in ROLE_TYPES]?: USER_TYPES[]; // Optional array of types for each role
  };
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") as ROLE_TYPES;
  const type = localStorage.getItem("userType") as USER_TYPES;

  // Redirect to login if the user is not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has one of the allowed roles
  if (!role || !allowedRoles[role]) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If the role has a specific list of types allowed
  const allowedTypes = allowedRoles[role];

  // If allowedTypes is provided, check the user type as well
  if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If no types are specified for the role, the user has full access
  return <Outlet />;
};

export default ProtectedRoute;
