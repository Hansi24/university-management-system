import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import campusLogo from '../../../assets/university-logo.png';
import bgImage from '../../../assets/bg.jpg';
import adImage from '../../../assets/ad.jpg';
import acImage from '../../../assets/ac.jpeg';
import { motion } from 'framer-motion';

// Import images for the features
import eventImage from '../../../assets/event-management.jpg';
import academicImage from '../../../assets/academic-management.jpeg';
import resourceImage from '../../../assets/resource-allocation.jpg';

const Home: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [bgImage, adImage, acImage]; // Array of background images

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Cycle through images
    }, 2000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 bg-opacity-80 w-full py-4 px-8 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src={campusLogo} alt="Campus Logo" className="w-12" />
            <h1 className="text-3xl font-bold text-white">NHDN University</h1>
          </div>
          <div className="flex space-x-6">
            <Link to="/events" className="text-gray-300 hover:text-white transition">
              Events
            </Link>
            <Link to="/About" className="text-gray-300 hover:text-white transition">
              About
            </Link>
            <Link to="/Contact" className="text-gray-300 hover:text-white transition">
              Contact
            </Link>
            <Link to="/login" className="text-gray-300 hover:text-white transition">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Welcome Section with Background Slider */}
      <div
        className="relative w-full h-[50vh] bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-extrabold text-white mb-6">Welcome to Smart Campus</h1>
          <Link
            to="/login"
            className="text-white font-bold py-3 px-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Text Section */}
      <section className="w-full bg-gray-800 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-3 text-center">
          <h2 className="text-4xl font-bold mb-4">Empowering Education for a Brighter Future</h2>
          <p className="text-lg">
            At NHDN University, we are committed to providing world-class education and fostering innovation.
            Our campus is equipped with state-of-the-art facilities to ensure students excel academically and
            personally. Join us in shaping the leaders of tomorrow.
          </p>
        </div>
      </section>

      {/* Feature Images Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16 w-full max-w-6xl mx-auto"
      >
        {[
          { title: 'Event Management', image: eventImage},
          { title: 'Academic Management', image: academicImage },
          { title: 'Resource Allocation', image: resourceImage},
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="relative rounded-xl shadow-2xl overflow-hidden transition-all border border-gray-700"
          >
            <img src={feature.image} alt={feature.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Link
                to={feature.title}
                className="text-white text-3xl font-bold hover:text-teal-400 transition"
              >
                {feature.title}
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gray-900 bg-opacity-90 text-gray-300 py-8 w-full text-center mt-16 shadow-2xl border-t border-gray-800"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-400">Email: info@nhdnuni.lk</p>
              <p className="text-gray-400">Phone: +94 112 345 678</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <Link to="/events" className="block text-gray-400 hover:text-white transition">
                Events
              </Link>
              <Link to="/academics" className="block text-gray-400 hover:text-white transition">
                Academics
              </Link>
              <Link to="/resources" className="block text-gray-400 hover:text-white transition">
                Resources
              </Link>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            &copy; 2025 Smart Campus Management System. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;