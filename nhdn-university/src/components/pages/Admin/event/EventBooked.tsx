import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backgroundImage from "../../../../assets/background.jpeg";
import { EventStatus, IEvent } from '../../../../models/Event';
import { CommonContext } from "../../../../context/commonContext";
import { useMessagePopup } from "../../../../context/useMessagePopup";
import { AppResponse } from "../../../../models/Response";
import { EventService } from "../../../../service/eventService";

const EventBooked = () => {
  const location = useLocation();
  const navigate = useNavigate();
//   const { selectedEvent, date, time, duration } = location.state || {};

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [bookedEvents, setBookedEvents] = useState<IEvent[]>([]);
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();

  useEffect(() => {
    // Fetch all booked events when the component loads
    const fetchEvents = async () => {
      try {
        const response: AppResponse<IEvent[]> = await EventService.getEventsByUser();
        if (response.success) {
          showSuccessMessage("Booked Events fetched successfully");
          setBookedEvents(response.data);
        } else {
          showErrorMessage(response.message || "Failed to fetch booked events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        showErrorMessage("An error occurred. Please try again.");
      } finally {
        setSpinnerOpen(false);
      }
    };
    fetchEvents();
  }, []);

  // Navigate to event details page
  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`); // Navigate to the event details page
  };

  // Handle event status update (e.g., cancel or approve)
  const handleEventStatus = async (index: number, eventStatus: EventStatus = EventStatus.CANCELLED) => {
    try {
      const event = bookedEvents[index];
      if (!event || !event._id) return;
      const response: AppResponse<IEvent> = await EventService.updateEvent(
        event._id,
        eventStatus
      );
      if (response.success) {
        showSuccessMessage(`Event request ${eventStatus} successfully`);
        const updatedEvents = [...bookedEvents];
        updatedEvents[index].status = eventStatus;
        setBookedEvents(updatedEvents);
      } else {
        showErrorMessage(response.message || `Failed to ${eventStatus} event request`);
      }
    } catch (error) {
      console.error(`Error ${eventStatus} event request:`, error);
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
          {/* Booked Events Table */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Your Booked Events</h2>

            {bookedEvents.length === 0 ? (
              <p className="text-center text-gray-500">You have no booked events yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  {/* Table Header */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
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
                    {bookedEvents.map((event, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        {/* Title */}
                        <td
                          className="px-6 py-4 text-sm text-gray-800 hover:text-blue-500 hover:underline"
                          onClick={() => handleEventClick(event._id!)}
                        >
                          {event.title}
                        </td>
                        {/* Description */}
                        <td className="px-6 py-4 text-sm text-gray-600">{event.description}</td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              event.status === EventStatus.PENDING
                                ? "bg-yellow-100 text-yellow-800"
                                : event.status === EventStatus.APPROVED
                                ? "bg-green-100 text-green-800"
                                : event.status === EventStatus.CANCELLED
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        {/* Date & Time */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDateTime(event.date).date} {formatDateTime(event.date).time}
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4 text-sm">
                          {event.status === EventStatus.APPROVED && (
                            <button
                              onClick={() => handleEventStatus(index, EventStatus.CANCELLED)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                            >
                              Cancel
                            </button>
                          )}
                          {event.status === EventStatus.CANCELLED && (
                            <p className="text-red-500 font-semibold">Cancelled</p>
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

export default EventBooked;