import React from 'react';
import { Link } from 'react-router-dom';
import campusLogo from '../../assets/university-logo.png'; 
import backgroundImage from '../../assets/background.webp';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center min-h-screen bg-cover bg-center bg-no-repeat p-10 text-white" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <section className="flex flex-col md:flex-row justify-between items-center mt-5 w-full max-w-5xl bg-black bg-opacity-50 p-6 rounded-lg">
        <div className="flex-1 p-5">
          <img src={campusLogo} alt="Campus Logo" className="w-32 mx-auto mb-4" />
          <h1 className="text-4xl font-bold">Welcome to the Smart Campus Management System</h1>
          <p className="text-lg text-gray-300 mt-4">
            Streamlining campus operations with integrated solutions for managing events and academics, enhancing participation, and maximizing resources.
          </p>
          <Link to="/login" className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 rounded transition">Get Started</Link>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10 w-full max-w-5xl">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg text-gray-800 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900">Event Management</h2>
          <p className="mt-2">Organize, manage, and track campus events to foster student and staff engagement. Keep everyone informed with real-time updates and seamless scheduling.</p>
          <Link to="/events" className="mt-3 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">Explore Events</Link>
        </div>
        <div className="bg-white bg-opacity-80 p-6 rounded-lg text-gray-800 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900">Academic Management</h2>
          <p className="mt-2">Manage courses, faculty assignments, student registrations, and track academic performance. Streamline the academic experience for both staff and students.</p>
          <Link to="/academics" className="mt-3 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">Explore Academics</Link>
        </div>
        <div className="bg-white bg-opacity-80 p-6 rounded-lg text-gray-800 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900">Resource Allocation</h2>
          <p className="mt-2">Maximize the use of campus resources such as classrooms, equipment, and faculty time. Efficient allocation ensures smooth operations across both events and academic activities.</p>
          <Link to="/resources" className="mt-3 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">Manage Resources</Link>
        </div>
      </section>
      
      <footer className="bg-black bg-opacity-70 text-white py-3 w-full text-center mt-10">
        <p className="text-sm">&copy; 2025 Smart Campus Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
