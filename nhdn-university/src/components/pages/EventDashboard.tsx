import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";
import backgroundImage from "../../assets/background.jpeg";

const EventBoard = () => {
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
    imageUrl: "/assets/football-match.png",
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <SideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />

        <div className="flex flex-col flex-grow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-semibold">{userInfo.degree}</p>
              <p>{userInfo.name}</p>
              <p>{userInfo.id}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow-md">
              <span className="text-lg font-semibold">Lecture Schedule</span>
              <div className="flex gap-4 mt-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <span key={day} className="bg-gray-300 px-3 py-1 rounded-lg">{day}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.role}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>
            <p className="mb-4">{post.content}</p>
            <img src={post.imageUrl} alt="Football Match" className="w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBoard;
