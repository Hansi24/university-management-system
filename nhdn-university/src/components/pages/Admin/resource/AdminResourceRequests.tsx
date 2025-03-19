import { useState, useEffect, useContext } from "react";
import backgroundImage from "../../../../assets/background.jpeg";
import { CommonContext } from "../../../../context/commonContext";
import { useMessagePopup } from "../../../../context/useMessagePopup";
import { IResourceBooking, BookingStatus } from "../../../../models/ResourceBooking";
import { AppResponse } from "../../../../models/Response";
import { ResourceService } from "../../../../service/resourceService";


const AdminResourceRequests = () => {
  const [requestedResources, setRequestedResources] = useState<IResourceBooking[]>([]);
  const [filter, setFilter] = useState<BookingStatus.PENDING | BookingStatus.RETURNED>(BookingStatus.PENDING); // State for active filter
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();

  useEffect(() => {
    // Fetch all requested resources when the component loads or filter changes
    const fetchRequestedResources = async () => {
      try {
        const response: AppResponse<IResourceBooking[]> = await ResourceService.getRequestedResources();
        if (response.success) {
          showSuccessMessage("Requested Resources fetched successfully");
          setRequestedResources(response.data);
        } else {
          showErrorMessage(response.message || "Failed to fetch requested resources");
        }
      } catch (error) {
        console.error("Error fetching requested resources:", error);
        showErrorMessage("An error occurred. Please try again.");
      } finally {
        setSpinnerOpen(false);
      }
    };
    fetchRequestedResources();
  }, [filter]); // Refetch when filter changes

  // Handle approve request
  const handleResourceStatus = async (index: number, bookingStatus:BookingStatus) => {
    try {
      const resource = requestedResources[index];
      const response: AppResponse<IResourceBooking> = await ResourceService.updateResourceStatus(
        resource._id,
        bookingStatus
      );
      if (response.success) {
        showSuccessMessage(`Resource request ${bookingStatus} successfully`);
        const updatedResources = [...requestedResources];
        updatedResources[index].status = bookingStatus;
        setRequestedResources(updatedResources);
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
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return {
      date: `${year}-${month}-${day}`, // e.g., "2023-10-25"
      time: `${hours}:${minutes}:${seconds}`, // e.g., "10:30:00"
    };
  };

  // Filter resources based on the active filter
  const filteredResources = requestedResources.filter((resource) => {
    if (filter === BookingStatus.PENDING) {
      return resource.status === BookingStatus.PENDING;
    } else if (filter === BookingStatus.RETURNED) {
      return resource.status === BookingStatus.RETURNED;
    }
    return true;
  });

  return (
    <div className="flex w-full min-h-screen bg-gray-100" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="flex flex-col flex-grow">
        <div className="flex-1 p-6">
          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter(BookingStatus.PENDING)}
              className={`px-6 py-2 rounded-lg shadow-md transition-all duration-300 ${
                filter === BookingStatus.PENDING
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pending Resources
            </button>
            <button
              onClick={() => setFilter(BookingStatus.RETURNED)}
              className={`px-6 py-2 rounded-lg shadow-md transition-all duration-300 ${
                filter === BookingStatus.RETURNED 
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Returned Resources
            </button>
          </div>

          {/* Requested Resources Table */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              {filter === "pending" ? "Pending Resources" : "Returned Resources"}
            </h2>

            {filteredResources.length === 0 ? (
              <p className="text-center text-gray-500">No {filter} resources found.</p>
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-200">
                    {filteredResources.map((resource, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        {/* Subject */}
                        <td className="px-6 py-4 text-sm text-gray-800">{resource.subject}</td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              resource.status === BookingStatus.PENDING
                                ? "bg-yellow-100 text-yellow-800"
                                : resource.status === BookingStatus.APPROVED
                                ? "bg-green-100 text-green-800"
                                : resource.status === BookingStatus.REJECTED
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {resource.status}
                          </span>
                        </td>
                        {/* Date & Time */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDateTime(resource.startTime).date} {formatDateTime(resource.startTime).time} -{" "}
                          {formatDateTime(resource.endTime).date} {formatDateTime(resource.endTime).time}
                        </td>
                        {/* Description */}
                        <td className="px-6 py-4 text-sm text-gray-600">{resource.description}</td>
                        {/* Actions */}
                        <td className="px-6 py-4 text-sm">
                          {resource.status === BookingStatus.PENDING && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleResourceStatus(index, BookingStatus.APPROVED)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleResourceStatus(index, BookingStatus.REJECTED)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {resource.status !== BookingStatus.PENDING && (
                            <p className="text-gray-500">No actions available</p>
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

export default AdminResourceRequests;