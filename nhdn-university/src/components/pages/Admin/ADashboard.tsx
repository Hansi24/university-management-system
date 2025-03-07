
import TitleBar from "../../layout/TitleBar";
import ASideBar from "./ASideBar";

const ADashboard = () => {
  
  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <ASideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        
        </div>
        </div>

      
  );
};

export default ADashboard;
