import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import backgroundImage from "../../assets/background.jpeg";

const BookResources = () => {
  const location = useLocation();
  const { selectedResource, date, time, duration } = location.state || {};

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [bookedResources, setBookedResources] = useState<any[]>([]);

  // Simulate fetching user bookings from an API or database
  useEffect(() => {
    // Sample data for bookings
    const sampleBookings = [
      {
        title: "Lecture Hall A - Building 1",
        date: "2023-03-10",
        time: "9:00 AM - 12:00 PM",
        status: "pending",
        description: "This is for a math lecture.",
      },
      {
        title: "A - Ground",
        date: "2023-03-15",
        time: "3:00 PM - 6:00 PM",
        status: "approved",
        description: "Football match event.",
      },
      {
        title: "Mini Auditorium",
        date: "2023-03-20",
        time: "12:00 PM - 3:00 PM",
        status: "approved",
        description: "Seminar on AI and ML.",
      },
    ];

    setBookedResources(sampleBookings);
  }, []);

  // Handle request for booking
  const handleSubmit = async () => {
    console.log("Booking request created:", { subject, description, selectedResource, date, time, duration });
    // You can implement the API call to save the new booking request here
    alert("Booking request submitted!");
  };

  // Handle return resource
  const handleReturn = (index: number) => {
    const updatedResources = bookedResources.map((booking, i) =>
      i === index ? { ...booking, status: "returned" } : booking
    );
    setBookedResources(updatedResources);
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <SideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="flex-1 p-6">
  
          {/* Booked Resources List */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Booked Resources</h2>

            {bookedResources.length === 0 ? (
              <p className="text-center text-gray-500">You have no booked resources yet.</p>
            ) : (
              <div className="space-y-4">
                {bookedResources.map((booking, index) => (
                  <div key={index} className="border p-4 rounded-md shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800">{booking.title}</h3>
                    <p className="text-gray-600">Date: {booking.date}</p>
                    <p className="text-gray-600">Time: {booking.time}</p>
                    <p className="text-gray-600">Status: 
                      <span
                        className={`font-semibold ${
                          booking.status === "pending"
                            ? "text-yellow-500"
                            : booking.status === "approved"
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                    <p className="text-gray-600 mt-2">{booking.description}</p>
                    {booking.status !== "returned" && (
                      <button
                        onClick={() => handleReturn(index)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                      >
                        Return
                      </button>
                    )}
                    {booking.status === "returned" && (
                      <p className="mt-4 text-green-500 font-semibold">Returned</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookResources;