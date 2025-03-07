import { Navigate, Outlet } from "react-router-dom";
import { ROLE_TYPES, USER_TYPES } from "./enums/roleEnums";

interface ProtectedRouteProps {
  allowedRoles: ROLE_TYPES[];
  allowedTypes?: USER_TYPES[]; // Optional: Only needed for type-based checks
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, allowedTypes }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") as ROLE_TYPES;
  const type = localStorage.getItem("type") as USER_TYPES;

  // Redirect to login if the user is not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has one of the allowed roles
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If allowedTypes is provided, check the user type as well
  if (allowedTypes && (!type || !allowedTypes.includes(type))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
