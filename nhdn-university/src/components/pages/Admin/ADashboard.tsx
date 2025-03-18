import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaTools, FaClock, FaCalendarAlt } from "react-icons/fa";
import TitleBar from "../../layout/TitleBar";
// import ASideBar from "./ASideBar";
import { motion } from "framer-motion";

const ADashboard = () => {

  // State for Date and Time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toDateString();
  // Statistics Data
  const stats = [
    { title: "Total Students", count: 2480, icon: <FaUserGraduate className="text-3xl text-blue-600" />, bgColor: "bg-blue-100" },
    { title: "Total Lecturers", count: 250, icon: <FaChalkboardTeacher className="text-3xl text-yellow-600" />, bgColor: "bg-yellow-100" },
    { title: "Courses", count: 12, icon: <FaBook className="text-3xl text-green-600" />, bgColor: "bg-green-100" },
    { title: "Resources", count: 345, icon: <FaTools className="text-3xl text-red-600" />, bgColor: "bg-red-100" },
  ];

  // Today's Events
  const events = [
    { title: "Football match", time: "8 AM - 1 PM" },
    { title: "IT Seminar", time: "9 AM - 1 PM" },
    { title: "Football match", time: "8 AM - 1 PM" },
  ];

  // Resource Requests
  const [resourceRequests, setResourceRequests] = useState([
    { id: 1, name: "Speaker", status: "pending" },
    { id: 2, name: "C - Room", status: "pending" },
  ]);

  // Event Requests (Placeholder for now)
  const [eventRequests, setEventRequests] = useState<{ name: string }[]>([]);

 // Resource Availability (Pie Chart)
 const resourceAvailability = [
  { name: "Available", value: 60, color: "green" },
  { name: "In Use", value: 30, color: "orange" },
  { name: "Under Maintenance", value: 10, color: "red" },
];

// Student Distribution per Course (Bar Chart)
const studentDistribution = [
  { course: "Computer Science", students: 800 },
  { course: "Engineering", students: 600 },
  { course: "Business", students: 400 },
  { course: "Arts", students: 300 },
  { course: "Science", students: 380 },
];


  // Handle Approve & Reject
  const handleResourceAction = (id: number, action: string) => {
    setResourceRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action } : req))
    );
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-purple-100 to-indigo-100">
      {/* <ASideBar /> */}
      <div className="flex flex-col flex-grow">
        {/* <TitleBar /> */}
        <div className="p-6">
          {/* Date and Time Display */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1 }}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6 text-gray-700"
          >
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-2xl text-purple-500" />
              <span className="text-lg font-semibold">{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-2xl text-red-500" />
              <span className="text-lg font-semibold">{formattedTime}</span>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`p-6 rounded-lg shadow-lg flex items-center space-x-4 ${stat.bgColor} hover:shadow-xl transition duration-300`}
              >
                {stat.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
    
      {/* Main Dashboard */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Section - Events */}
        <div className="bg-white p-4 rounded-lg shadow-lg col-span-1">
          <h2 className="text-xl font-bold mb-4">Today Events</h2>
          {events.map((event, index) => (
            <div key={index} className="bg-gray-400 text-white px-4 py-2 rounded-md mb-2">
              <span className="font-bold">{event.title}</span> <span className="float-right">{event.time}</span>
            </div>
          ))}
        </div>

        {/* Middle Section - Resource Availability Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-lg col-span-1">
              <h2 className="text-xl font-bold mb-4 text-center">Resource Availability</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={resourceAvailability} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {resourceAvailability.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right Section - Student Distribution Bar Chart */}
            <div className="bg-white p-4 rounded-lg shadow-lg col-span-1">
              <h2 className="text-xl font-bold mb-4 text-center">Students per Course</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={studentDistribution}>
                  <XAxis dataKey="course" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#4285F4" />
                </BarChart>
              </ResponsiveContainer>
        </div>
      </div>

      {/* Resource & Event Requests */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Resource Requests */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Resource Requests</h2>
          {resourceRequests.map((request) => (
            <div key={request.id} className="flex justify-between items-center mb-2 p-2 border rounded-md">
              <p className="text-gray-700">{request.name}</p>
              {request.status === "pending" ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleResourceAction(request.id, "approved")}
                    className="bg-blue-400 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleResourceAction(request.id, "rejected")}
                    className="bg-red-400 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`px-3 py-1 rounded-md ${
                    request.status === "approved" ? "bg-green-400 text-white" : "bg-gray-400 text-white"
                  }`}
                >
                  {request.status.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Event Requests */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Event Requests</h2>
          {eventRequests.length === 0 ? (
            <p className="text-gray-500">No event requests at the moment.</p>
          ) : (
            eventRequests.map((event, index) => (
              <div key={index} className="p-2 border rounded-md mb-2">{event.name}</div>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default ADashboard;
