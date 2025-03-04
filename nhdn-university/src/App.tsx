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
        </Routes>
      </div>
    </Router>
  );
}

export default App;