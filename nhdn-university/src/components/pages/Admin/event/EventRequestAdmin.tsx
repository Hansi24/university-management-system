import { useState, useEffect, useContext } from "react";
import { CommonContext } from "../../../../context/commonContext";
import { useMessagePopup } from "../../../../context/useMessagePopup";
import { EventStatus, IEvent } from "../../../../models/Event";
import { AppResponse } from "../../../../models/Response";
import { EventService } from "../../../../service/eventService";

const EventRequestAdmin = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filter, setFilter] = useState<EventStatus>(EventStatus.PENDING); // Default filter
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setSpinnerOpen(true);
        const response: AppResponse<IEvent[]> = await EventService.getEvents(filter);
        if (response.success) {
          showSuccessMessage("Events fetched successfully");
          setEvents(response.data);
        } else {
          showErrorMessage(response.message || "Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        showErrorMessage("An error occurred. Please try again.");
      } finally {
        setSpinnerOpen(false);
      }
    };

    fetchEvents();
  }, [filter]); // Refetch when filter changes

  // Handle event status update
  const handleEventStatus = async (index: number, newStatus: EventStatus) => {
    try {
      const event = events[index];
      if (!event || !event._id) return;
      const response: AppResponse<IEvent> = await EventService.updateEvent(event._id, newStatus);
      if (response.success) {
        showSuccessMessage(`Event ${newStatus} successfully`);
        const updatedEvents = [...events];
        updatedEvents[index].status = newStatus;
        setEvents(updatedEvents);
      } else {
        showErrorMessage(response.message || `Failed to ${newStatus} event`);
      }
    } catch (error) {
      console.error(`Error updating event status:`, error);
      showErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <div className="flex flex-col flex-grow">
        <div className="p-6">
          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter(EventStatus.PENDING)}
              className={`px-6 py-2 rounded-lg shadow-md transition-all ${
                filter === EventStatus.PENDING
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Pending Events
            </button>
            <button
              onClick={() => setFilter(EventStatus.APPROVED)}
              className={`px-6 py-2 rounded-lg shadow-md transition-all ${
                filter === EventStatus.APPROVED
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Approved Events
            </button>
          </div>

          {/* Event List */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">
              {filter === EventStatus.PENDING ? "Pending Events" : "Approved Events"}
            </h2>

            {events.length === 0 ? (
              <p className="text-center text-gray-500">No {filter} events found.</p>
            ) : (
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Event Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Organizer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((event, index) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{event.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.organizerId.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600"> {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}</td>
                      <td className="px-6 py-4 text-sm text-gray-600"> {event.location}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            event.status === EventStatus.PENDING
                              ? "bg-yellow-100 text-yellow-800"
                              : event.status === EventStatus.APPROVED
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {event.status === EventStatus.PENDING && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEventStatus(index, EventStatus.APPROVED)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleEventStatus(index, EventStatus.REJECTED)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {event.status !== EventStatus.PENDING && (
                          <p className="text-gray-500">No actions available</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRequestAdmin;
