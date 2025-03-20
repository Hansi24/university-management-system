import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IEvent, EventStatus } from "../../../../models/Event";
import { AppResponse } from "../../../../models/Response";
import { EventService } from "../../../../service/eventService";
import { CommonContext } from "../../../../context/commonContext";
import { useMessagePopup } from "../../../../context/useMessagePopup";
import { FaArrowLeft, FaBackspace, FaImage } from "react-icons/fa";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();
  const [activeTab, setActiveTab] = useState<
    "details" | "participants" | "flyer"
  >("details"); // Added "flyer" tab

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setSpinnerOpen(true);
        const response: AppResponse<IEvent> = await EventService.getEventById(
          eventId!
        );
        if (response.success) {
          setEvent(response.data);
          showSuccessMessage("Event details fetched successfully");
        } else {
          showErrorMessage(response.message || "Failed to fetch event details");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        showErrorMessage("An error occurred. Please try again.");
      } finally {
        setSpinnerOpen(false);
      }
    };

    const fetchParticipants = async () => {
      try {
        const response: AppResponse<string[]> =
          await EventService.getEventParticipants(eventId!);
        if (response.success) {
          setParticipants(response.data);
        } else {
          showErrorMessage(response.message || "Failed to fetch participants");
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
        showErrorMessage("An error occurred. Please try again.");
      }
    };

    fetchEventDetails();
    fetchParticipants();
  }, [eventId]);

  if (!event) {
    return (
      <p className="text-center text-gray-500">Loading event details...</p>
    );
  }

  return (
    <div className="flex w-full min-h-[680px] h-auto bg-gray-100 p-6">
      {/* Right Side - Event Details, Participants, and Flyer */}
      <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-full">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="px-4 py-2 bg-gray-200 text-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "details"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Event Details
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "participants"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "flyer"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("flyer")}
          >
            View Flyer
          </button>
        </div>

        {/* Event Details Tab */}
        {activeTab === "details" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Title:
              </label>
              <p className="text-lg text-gray-800">{event.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Date & Time:
              </label>
              <p className="text-lg text-gray-800">
                {new Date(event.date).toLocaleDateString()}{" "}
                {new Date(event.date).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Description:
              </label>
              <p className="text-lg text-gray-800">{event.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Location:
              </label>
              <p className="text-lg text-gray-800">{event.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Status:
              </label>
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
            </div>
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === "participants" && (
          <div className="mt-8">
            {participants.length === 0 ? (
              <p className="text-center text-gray-500">No participants yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                        #
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                        Name
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                        Email
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                        Registration ID
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                        Batch
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                        Phone
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                        Course
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 flex items-center">
                          {participant.userId.profilePic ? (
                            <img
                              src={participant.userId.profilePic}
                              alt="Profile"
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                          )}
                          {participant.userId.name}
                        </td>
                        <td className="px-6 py-4">
                          {participant.userId.email}
                        </td>
                        <td className="px-6 py-4">
                          {participant.userId.regId}
                        </td>
                        <td className="px-6 py-4">
                          {participant.userId.batch}
                        </td>
                        <td className="px-6 py-4">
                          {participant.userId.phone}
                        </td>
                        <td className="px-6 py-4">
                          {participant.userId.courseId?.name || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Flyer Tab */}
        {activeTab === "flyer" && (
          <div className="mt-8 flex justify-center items-center">
            {typeof event.flyer === "string" ? (
              <div
                className="w-full h-[680px] bg-gray-200 rounded-lg shadow-md mx-auto"
                style={{
                  backgroundImage: `url(${event.flyer})`,
                  backgroundSize: "cover", // Ensures the image covers the entire div
                  backgroundPosition: "center", // Centers the image
                }}
              ></div>
            ) : (
              <p className="text-center text-gray-500">No flyer available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
