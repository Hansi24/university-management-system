import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/common/Home';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CreateAssignment from './components/pages/lecturer/CreateAssignment';
import { TokenProvider } from './context/TokenContext';
import { CommonProvider } from './context/commonContext';
import { ToastProvider } from './context/ToastContext';
import { Suspense } from 'react';
import { Spinner } from './reuse/Spinner';
import ProtectedRoute from './ProtectedRoute';
import { AdminType, ROLE_TYPES, StudentType } from './enums/roleEnums';
import ADashboard from './components/pages/Admin/ADashboard';
import TimeTable from './components/pages/Admin/TimeTable';
import CourseDetails from './components/pages/Admin/academic/CourseDetails';
import UserDetails from './components/pages/Admin/academic/UserDeatails';
import BookResources from './components/pages/common/BookResources';
import CreatePost from './components/pages/common/CreatePost';
import EventBoard from './components/pages/common/EventDashboard';
import LearnLog from './components/pages/common/LearnLog';
import Module from './components/pages/common/Module';
import ResourceAvailability from './components/pages/common/ResourceAvailability';
import Semester from './components/pages/common/Semester';
import EnrollSem from './components/pages/student/EnrollSem';
import ResourceRequests from './components/pages/Admin/resource/ResourceRequests';


const App: React.FC = () => {
  return (
    <TokenProvider>
      <CommonProvider>
        <ToastProvider>
        <Spinner />
          <Router>
            <Suspense fallback={<Spinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                <Route path="/CreateAssignment" element={<CreateAssignment />} /> 
                <Route path="/EnrollSem" element={<EnrollSem />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/AdminDashboard" element={<ADashboard />} />
                <Route path="/UserDetails" element={<UserDetails />} />
                <Route path="/CourseDetails" element={<CourseDetails />} />
                <Route path="/CreatePost" element={<CreatePost/>}/>
                <Route path="/ResourceAvailability" element={<ResourceAvailability/>}/>
                <Route path="/TimeTable" element={<TimeTable/>}/>
                <Route path="/event-dashboard" element={<EventBoard />} />
                <Route path="/LearnLog" element={<LearnLog />} />
                <Route path="/semester/:id" element={<Semester />} />
                <Route path="/module/:id" element={<Module />} />
                <Route path="/BookResources" element={<BookResources />} />
                <Route path="/ResourceRequests" element={<ResourceRequests />} />
                
                {/* Role-Based Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={[ROLE_TYPES.LECTURER]}/>}>
                  <Route path="/CreateAssignment" element={<CreateAssignment />} /> 
                </Route>

                <Route element={<ProtectedRoute allowedRoles={[ROLE_TYPES.STUDENT]}/>}>
                  <Route path="/EnrollSem" element={<EnrollSem />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={[ROLE_TYPES.ADMIN]} allowedTypes={[AdminType.ACADEMIC]}/>}>
                  <Route path="/register" element={<Register />} />
                  <Route path="/AdminDashboard" element={<ADashboard />} />
                  <Route path="/UserDetails" element={<UserDetails />} />
                  <Route path="/CourseDetails" element={<CourseDetails />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={[ROLE_TYPES.ADMIN]}/>}>
                  <Route path="/AdminDashboard" element={<ADashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={[ROLE_TYPES.LECTURER, ROLE_TYPES.STUDENT , ROLE_TYPES.ADMIN]} allowedTypes={[StudentType.REP, AdminType.EVENT]}/>}>
                  <Route path="/CreatePost" element={<CreatePost/>}/>
                  <Route path="/ResourceAvailability" element={<ResourceAvailability/>}/>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={[ROLE_TYPES.LECTURER, ROLE_TYPES.STUDENT , ROLE_TYPES.ADMIN]} allowedTypes={[AdminType.ACADEMIC, AdminType.EVENT]}/>}>
                  <Route path="/TimeTable" element={<TimeTable/>}/>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={[ROLE_TYPES.LECTURER, ROLE_TYPES.STUDENT]} allowedTypes={[StudentType.REP]} />}>
                  <Route path="/CreatePost" element={<CreatePost />} />
                  <Route path="/ResourceAvailability" element={<ResourceAvailability />} />
                  <Route path="/BookResources" element={<BookResources />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={[ROLE_TYPES.LECTURER, ROLE_TYPES.STUDENT]} />}>
                  <Route path="/event-dashboard" element={<EventBoard />} />
                  <Route path="/LearnLog" element={<LearnLog />} />
                  <Route path="/semester/:id" element={<Semester />} />
                  <Route path="/module/:id" element={<Module />} />
                </Route>
                

                {/* Unauthorized Page */}
                <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
                <Route path="*" element={<h2>404- Page Not Found</h2>} /> {/* Catch all unmatched paths */}
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </CommonProvider>
    </TokenProvider>
  );
};

export default App;