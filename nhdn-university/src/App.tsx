import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventBoard from './components/pages/EventDashboard';
import CreatePost from './components/pages/CreatePost';
import ResourceAvailability from './components/pages/ResourceAvailability';
import TimeTable from './components/pages/TimeTable';
import BookResources from './components/pages/BookResources';
import LearnLog from './components/pages/LearnLog';
import Semester from './components/pages/Semester';
import Module from './components/pages/Module';
import ADashboard from './components/pages/Admin/ADashboard';
import UserDetails from './components/pages/Admin/UserDeatails';
import CourseDetails from './components/pages/Admin/CourseDetails';
import EnrollSem from './components/pages/EnrollSem';
import CreateAssignment from './components/pages/CreateAssignment';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/EventBoard" element={<EventBoard />} />
          <Route path="/CreatePost" element={<CreatePost/>}/>
          <Route path="/ResourceAvailability" element={<ResourceAvailability/>}/>
          <Route path="/TimeTable" element={<TimeTable/>}/>
          <Route path="/BookResources" element={<BookResources/>}/>
          <Route path="/LearnLog" element={<LearnLog/>}/>
          <Route path="/semester/:id" element={<Semester />} />
          <Route path="/module/:id" element={<Module />} />
          <Route path="/AdminDashboard" element={<ADashboard />} />
          <Route path="/UserDetails" element={<UserDetails />} />
          <Route path="/CourseDetails" element={<CourseDetails />} />
          <Route path="/EnrollSem" element={<EnrollSem />} />
          <Route path="/CreateAssignment" element={<CreateAssignment />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;