import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaUserCircle } from "react-icons/fa";
import { MdEvent, MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";
import backgroundImage from "../../assets/background.jpeg";
import campusLogo from "../../assets/university-logo.png";

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
  const year = date.getFullYear();
  const month = date.getMonth();
  const calendar = generateCalendar(year, month);

  const userInfo = {
    degree: "BSc in Software Engineering (2021-2024)",
    name: "S.H.H. Sewwandi",
    id: "E123122",
  };

  const post = {
    author: "S.H.H. Diveshkar",
    role: "Secretary (Sport Club)",
    date: "2023-12-06 5:22:09",
    content:
      "Get ready for an exciting football match 🎉🔥 Join us as our teams battle it out on the field for glory and bragging rights... see more..",
    imageUrl: "/mnt/data/image.png",
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <SideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="flex flex-grow p-6 gap-6">
          {/* Main Content */}
          <div className="flex-grow">
            {/* <div className="w-500 bg-gradient-to-r from-indigo-500 to-blue-200 text-white p-5 rounded-lg shadow-md">
              <p className="font-semibold text-xl">{userInfo.degree}</p>
              <p className="flex items-center gap-2 text-lg"><FaUserCircle /> {userInfo.name}</p>
              <p className="text-sm">ID: {userInfo.id}</p>
            </div> */}

            <div className="bg-white p-6 scroll-m-0 rounded-lg shadow-md mt-0 h-[450px] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-lg">{post.author}</p>
                    <p className="text-sm text-gray-500">{post.role}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <p className="mb-4 text-gray-800">{post.content}</p>
              <img src={post.imageUrl} alt="Event" className="w-full rounded-lg" />
            </div>
          </div>  

          {/* Right Sidebar */}
          <div className="w-80 h-full bg-white p-4 rounded-lg shadow-md">
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
