import React from 'react';
import { Link } from 'react-router-dom';
import campusLogo from '../../../assets/university-logo.png'; 
import backgroundImage from '../../../assets/background.jpeg';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center min-h-screen bg-cover bg-center bg-no-repeat p-10 text-white" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* University Logo and Name */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="flex flex-col items-center mt-5 w-full max-w-5xl bg-gray-900 bg-opacity-70 p-6 rounded-lg shadow-xl border border-gray-700"
      >
        <img src={campusLogo} alt="Campus Logo" className="w-40 mb-4" />
        <h1 className="text-4xl font-bold text-white">NHDN University Of Sri Lanka</h1>
      </motion.div>
      
      {/* Welcome Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="flex flex-col md:flex-row justify-between items-center mt-5 w-full max-w-5xl bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700"
      >
        <div className="flex-1 p-5 text-left">
          <h1 className="text-5xl font-extrabold text-gray-100">Welcome to Smart Campus</h1>
          <p className="text-lg text-gray-400 mt-4">
            Enhancing campus life with innovative event, academic, and resource management solutions.
          </p>
          <Link to="/login" className="mt-6 inline-block text-white font-bold py-3 px-6 rounded-full bg-orange-400 transition shadow-lg">Get Started</Link>
        </div>
      </motion.section>
      
      {/* Feature Cards */}
      <motion.section 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 w-full max-w-5xl"
      >
        {[
          { title: "Event Management", desc: "Organize and track campus events with real-time updates and scheduling.", link: "/events", color: "bg-gradient-to-r from-indigo-500 to-purple-500" },
          { title: "Academic Management", desc: "Manage courses, faculty assignments, and student registrations seamlessly.", link: "/academics", color: "bg-gradient-to-r from-green-500 to-teal-500" },
          { title: "Resource Allocation", desc: "Maximize resource utilization across campus with smart allocations.", link: "/resources", color: "bg-gradient-to-r from-red-500 to-yellow-500" }
        ].map((feature, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-lg shadow-xl text-white ${feature.color} bg-opacity-90 hover:bg-opacity-100 transition border border-gray-700`}
          >
            <h2 className="text-3xl font-semibold">{feature.title}</h2>
            <p className="mt-3 text-gray-200">{feature.desc}</p>
            <Link to={feature.link} className="mt-4 inline-block bg-gray-900 text-white font-semibold py-2 px-4 rounded-full shadow-md transition hover:bg-gray-700">Explore</Link>
          </motion.div>
        ))}
      </motion.section>
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="bg-gray-900 text-gray-300 py-4 w-full text-center mt-10 shadow-md border-t border-gray-700"
      >
        <p className="text-sm">&copy; 2025 Smart Campus Management System. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default Home;
