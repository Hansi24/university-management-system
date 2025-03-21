import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/common/Home";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CreateAssignment from "./components/pages/lecturer/CreateAssignment";
import { TokenProvider } from "./context/TokenContext";
import { CommonProvider } from "./context/commonContext";
import { ToastProvider } from "./context/ToastContext";
import { Suspense } from "react";
import { Spinner } from "./reuse/Spinner";
import ProtectedRoute from "./ProtectedRoute";
import { AdminType, LecturerType, ROLE_TYPES, StudentType } from "./enums/roleEnums";
import ADashboard from "./components/pages/Admin/ADashboard";
import TimeTable from "./components/pages/Admin/academic/TimeTable";
import CourseDetails from "./components/pages/Admin/academic/CourseDetails";
import UserDetails from "./components/pages/Admin/academic/UserDeatails";
import BookResources from "./components/pages/common/BookResources";
import CreatePost from "./components/pages/common/CreatePost";
import EventBoard from "./components/pages/common/EventDashboard";
import LearnLog from "./components/pages/common/LearnLog";
import Module from "./components/pages/common/Module";
import ResourceAvailability from "./components/pages/common/ResourceAvailability";
import Semester from "./components/pages/common/Semester";
import EnrollSem from "./components/pages/student/EnrollSem";
import Unauthorized from "./components/pages/common/Unauthorized";
import Layout from "./components/layout/Layout";
import MaterialDetails from "./components/pages/common/MaterialDetails";
import SubmissionDetails from "./components/pages/common/SubmissionDetails";
import AdminResourceRequests from "./components/pages/Admin/resource/AdminResourceRequests";
import ResourceManagement from "./components/pages/Admin/resource/ResourceManagement";
import CreateResource from "./components/pages/Admin/resource/CreateResource";
import EventRequestAdmin from "./components/pages/Admin/event/EventRequestAdmin";
import UserProfile from "./components/pages/common/UserProfile";
import EventBooked from "./components/pages/Admin/event/EventBooked";
import EventDetails from "./components/pages/Admin/event/EventDetails";

const App: React.FC = () => {
  return (
    <TokenProvider>
      <CommonProvider>
        <ToastProvider>
          <Router>
            {/* Spinner Component */}
            <Spinner />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
          path="/profile"
          element={
            
              <UserProfile />
            
          }
          />

              {/* Role-Based Protected Routes */}
              <Route element={<Layout />}>
                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.LECTURER]: [], // Full access for LECTURER
                  [ROLE_TYPES.ADMIN]: [AdminType.ACADEMIC], // Admin restricted to Academic Type
                }} />}>
                  <Route path="/CreateAssignment" element={<CreateAssignment />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.STUDENT]: [] // Full access for Student
                }} />}>
                  <Route path="/EnrollSem" element={<EnrollSem />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.ADMIN]: [AdminType.ACADEMIC] // Admin restricted to Academic Type
                }} />}>
                  <Route path="/register" element={<Register />} />
                  <Route path="/UserDetails" element={<UserDetails />} />
                  <Route path="/CourseDetails" element={<CourseDetails />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.ADMIN]: [] // Full access for Admin
                }} />}>
                  <Route path="/admin-dashboard" element={<ADashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.LECTURER]: [], 
                  [ROLE_TYPES.STUDENT]: [StudentType.REP],
                  [ROLE_TYPES.ADMIN]: [AdminType.EVENT] 
                }} />}>
                  <Route path="/CreatePost" element={<CreatePost />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.LECTURER]: [], // Specific types for Lecturer
                  [ROLE_TYPES.STUDENT]: [], // Specific types for Student
                  [ROLE_TYPES.ADMIN]: [AdminType.ACADEMIC, AdminType.EVENT] // Specific types for Admin
                }} />}>
                  <Route path="/TimeTable" element={<TimeTable />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.LECTURER]: [], // Full access for Lecturer
                  [ROLE_TYPES.STUDENT]: [StudentType.REP],
                  [ROLE_TYPES.ADMIN]:[AdminType.RESOURCE] // Full access for Student
                }} />}>
                  <Route path="/BookResources" element={<BookResources />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.LECTURER]: [], // Full access for Lecturer
                  [ROLE_TYPES.STUDENT]: [StudentType.REP],
                  [ROLE_TYPES.ADMIN]:[] // Full access for Student
                }} />}>
                  <Route path="/ResourceAvailability" element={<ResourceAvailability />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.ADMIN]:[AdminType.RESOURCE] // Full access for Student
                }} />}>
                  <Route path="/ManageResource" element={<AdminResourceRequests />} />
                  <Route path="/ResourceManagement" element={<ResourceManagement />} />
                  <Route path="/CreateResource" element={<CreateResource />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.ADMIN]:[AdminType.EVENT] // Full access for Student
                }} />}>
                  <Route path="/RequestEvent" element={<EventRequestAdmin />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.STUDENT]:[StudentType.REP],
                  [ROLE_TYPES.LECTURER]: [], // Full access for Student
                  [ROLE_TYPES.ADMIN]:[AdminType.EVENT] 
                }} />}>
                  <Route path="/BookedEvent" element={<EventBooked />} />
                  <Route path="/events/:eventId" element={<EventDetails />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={{
                  [ROLE_TYPES.LECTURER]: [], // Full access for Lecturer
                  [ROLE_TYPES.STUDENT]: [] // Full access for Student
                }} />}>
                  <Route path="/event-dashboard" element={<EventBoard />} />
                  <Route path="/LearnLog" element={<LearnLog />} />
                  <Route path="/semester/:id" element={<Semester />} />
                  <Route path="/module/:id" element={<Module />} />
                  {/* Material Details Page */}
                  <Route path="/module/:id/materials/:materialId" element={<MaterialDetails />} />
                  {/* Submission Details Page */}
                  <Route path="/module/:id/materials/:materialId/submissions/:submissionId" element={<SubmissionDetails />} />
                </Route>
              </Route>

              {/* Unauthorized & 404 Pages */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            </Routes>
          </Router>
        </ToastProvider>
      </CommonProvider>
    </TokenProvider>
  );
};

export default App;