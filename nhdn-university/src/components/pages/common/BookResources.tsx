import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import backgroundImage from "../../../assets/background.jpeg";
import { BookingStatus, IResourceBooking } from "../../../models/ResourceBooking";
import { AppResponse } from "../../../models/Response";
import { ResourceService } from "../../../service/resourceService";
import { CommonContext } from "../../../context/commonContext";
import { useMessagePopup } from "../../../context/useMessagePopup";

const BookResources = () => {
  const location = useLocation();
  const { selectedResource, date, time, duration } = location.state || {};

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [bookedResources, setBookedResources] = useState<IResourceBooking[]>([]);
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();

  useEffect(() => {
    // Fetch all resources when the component loads
    const fetchResources = async () => {
      try {
        const response: AppResponse<IResourceBooking[]> = await ResourceService.getBookedResource();
        if (response.success) {
          showSuccessMessage("Booked Resources fetched successfully");
          setBookedResources(response.data);
        } else {
          showErrorMessage(response.message || "Failed to fetch booked resources");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        showErrorMessage("An error occurred. Please try again.");
      } finally {
        setSpinnerOpen(false);
      }
    };
    fetchResources();
  }, []);

  // Handle request for booking
  const handleSubmit = async () => {
    console.log("Booking request created:", { subject, description, selectedResource, date, time, duration });
    // You can implement the API call to save the new booking request here
    alert("Booking request submitted!");
  };

  // Handle return resource
  const handleResourceStatus = async (index: number, bookingStatus:BookingStatus = BookingStatus.RETURNED) => {
    try {
      const resource = bookedResources[index];
      const response: AppResponse<IResourceBooking> = await ResourceService.updateResourceStatus(
        resource._id,
        bookingStatus
      );
      if (response.success) {
        showSuccessMessage(`Resource request ${bookingStatus} successfully`);
        const updatedResources = [...bookedResources];
        updatedResources[index].status = bookingStatus;
        setBookedResources(updatedResources);
      } else {
        showErrorMessage(response.message || `Failed to ${bookingStatus} resource request`);
      }
    } catch (error) {
      console.error(`Error ${bookingStatus} resource request:`, error);
      showErrorMessage("An error occurred. Please try again.");
    }
  };

  // Format date and time
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");


    return {
      date: `${year}-${month}-${day}`, // e.g., "2023-10-25"
      time: `${hours}:${minutes}`, // e.g., "10:30:00"
    };
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* <SideBar /> */}
      <div className="flex flex-col flex-grow">
        {/* <TitleBar /> */}
        <div className="flex-1 p-6">
          {/* Booked Resources Table */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Your Booked Resources</h2>

            {bookedResources.length === 0 ? (
              <p className="text-center text-gray-500">You have no booked resources yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  {/* Table Header */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resource
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {/* Table Body */}
                  <tbody className="divide-y cursor-pointer divide-gray-200">
                    {bookedResources.map((booking, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        {/* Subject */}
                        <td className="px-6 py-4 text-sm text-gray-800">{booking.subject}</td>
                        {/* Description */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {typeof booking.resourceId === "string" ? booking.resourceId : booking.resourceId.name}
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === BookingStatus.PENDING
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === BookingStatus.APPROVED
                                ? "bg-green-100 text-green-800"
                                : booking.status === BookingStatus.REJECTED
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        {/* Date & Time */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDateTime(booking.startTime).date} {formatDateTime(booking.startTime).time} -{" "}
                          {formatDateTime(booking.endTime).date} {formatDateTime(booking.endTime).time}
                        </td>
                        {/* Actions */}
                          <td className="px-6 py-4 text-sm">
                          {booking.status === BookingStatus.APPROVED && (
                            <button
                              onClick={() => handleResourceStatus(index)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                            >
                              Return
                            </button>
                          )}
                          {booking.status === BookingStatus.RETURNED && (
                            <p className="text-green-500 font-semibold">Returned</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookResources;