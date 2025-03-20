import { useState, useEffect, useContext } from "react";
import { FaChevronLeft, FaChevronRight, FaUserCircle } from "react-icons/fa";
import { MdEvent, MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import backgroundImage from "../../../assets/background.jpeg";
import campusLogo from "../../../assets/university-logo.png";
import { IEvent } from "../../../models/Event";
import { EventService } from "../../../service/eventService";
import { AppResponse } from "../../../models/Response";
import { EventParticipationStatus } from "../../../enums/eventStatus";
import { IEventAttendee } from "../../../models/EventAttendee";
import { CommonContext } from "../../../context/commonContext";
import { useMessagePopup } from "../../../context/useMessagePopup";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const generateCalendar = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar = [];
  let week = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    calendar.push(week);
  }

  return calendar;
};

const EventBoard = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<IEvent[]>([]); // State to store events
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();

  const year = date.getFullYear();
  const month = date.getMonth();
  const calendar = generateCalendar(year, month);

  const userInfo = {
    degree: "BSc in Software Engineering (2021-2024)",
    name: "S.H.H. Sewwandi",
    id: "E123122",
  };

  // Fetch upcoming approved events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response: AppResponse<IEvent[]> = await EventService.getUpcomingApprovedEvents();
        if (response.success) {
          setEvents(response.data);
        } else {
          setError(response.message || "Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle participation checkbox change
  const handleParticipationChange = async (eventId: string, isChecked: boolean) => {
    try {
      // Determine the participation status based on the checkbox state
      const participationStatus = isChecked
        ? EventParticipationStatus.ATTENDING
        : EventParticipationStatus.NOT_ATTENDING;

      // Call an API to update the participation status
      const response: AppResponse<IEventAttendee> = await EventService.updateParticipation(eventId, participationStatus);
      if (response.success) {
        if (response.data.status === EventParticipationStatus.ATTENDING) {
          showSuccessMessage("You have successfully registered for the event");
        } else if (response.data.status === EventParticipationStatus.NOT_ATTENDING) {
          showSuccessMessage("You have successfully unregistered for the event");
        }
      }
    } catch (error) {
      console.error("Error updating participation:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading events...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex w-full h-[682px]  bg-gray-50" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", // Ensures the image covers the entire div
    backgroundPosition: "center"  }}>
      {/* <SideBar /> */}
      <div className="flex flex-col flex-grow">
        {/* <TitleBar /> */}
        <div className="flex flex-grow p-6 gap-6">
          {/* Main Content */}
          <div className="flex-grow w-[900px]">
            <div className="bg-white p-6 scroll-m-0 rounded-lg shadow-md mt-0 h-[630px] overflow-y-auto">
              {events.map((event) => (
                <div key={event._id} className="bg-white p-5 rounded-lg shadow-md mb-6 border border-gray-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-lg text-gray-800">{event.organizerId.name}</p>
                        <p className="text-sm text-gray-500">{event.organizerId.email}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</span>
                  </div>
                  <p className="mb-4 text-gray-700">{event.description}</p>
                  {event.flyer && (
                    <img src={event.flyer} alt="Event Flyer" className="w-full rounded-lg shadow-md mb-4" />
                  )}
                  {/* Participation Checkbox */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={(e) => event._id && handleParticipationChange(event._id, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="text-gray-800 font-medium">Participate</span>
                  </label>
                </div>
              ))}
            </div>
          </div>  

          {/* Right Sidebar */}
          <div className="h-[630px] bg-white p-4 rounded-lg shadow-md">
            {/* Calendar Section */}
            <div className="">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setDate(new Date(year, month - 1))}><FaChevronLeft /></button>
                <span className="text-lg font-semibold">{date.toLocaleString('default', { month: 'long' })} {year}</span>
                <button onClick={() => setDate(new Date(year, month + 1))}><FaChevronRight /></button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-gray-800">
                {daysOfWeek.map((day) => (
                  <div key={day} className="font-semibold text-sm">{day}</div>
                ))}
                {calendar.flat().map((day, index) => (
                  <div key={index} className="p-2 rounded-lg text-gray-700 text-sm">{day || ''}</div>
                ))}
              </div>
            </div>

            {/* University Info Section */}
            <div className="bg-gradient-to-r from-blue-200 to-blue-500 text-white mt-2 p-5 rounded-lg text-center">
              <img src={campusLogo} alt="University Logo" className="w-24 h-24 mx-auto " />
              <p className="font-semibold text-lg flex items-center justify-center gap-2"><MdEvent /> NHDN University</p>
              <p className="text-sm flex items-center justify-center gap-2"><MdLocationOn /> No12, Lake Street, Colombo 07.</p>
              <p className="text-sm flex items-center justify-center gap-2"><MdEmail /> nhduni@gmail.lk</p>
              <p className="text-sm flex items-center justify-center gap-2"><MdPhone /> Tel: +117563423</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBoard;