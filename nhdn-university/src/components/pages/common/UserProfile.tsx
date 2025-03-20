import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CommonContext } from "../../../context/commonContext";
import { useTokenContext } from "../../../context/TokenContext";
import { useMessagePopup } from "../../../context/useMessagePopup";
import { AuthService } from "../../../service/authService";
import { AppResponse } from "../../../models/Response";
import { IUsers } from "../../../models/RegistraionFormData";
import backgroundImage from "../../../assets/background.jpeg";
import SideBar from "../../layout/SideBar";
import TitleBar from "../../layout/TitleBar";

const UserProfile: React.FC = () => {
  const [userDetails, setUserDetails] = useState<IUsers | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage } = useMessagePopup();
  const navigate = useNavigate();
  const { token } = useTokenContext();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");

        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response: AppResponse<IUsers> = await AuthService.getUserDetails();


        if (response.success) {
          setUserDetails(response.data);
        } else {
          throw new Error("Failed to retrieve user details");
        }
      } catch (error: any) {
        console.error("Error fetching user details:", error);
        setError(error.message);
        showErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg font-semibold">User details not available.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-100" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <SideBar />
    <div className="flex flex-col flex-grow">
      <TitleBar />
        <div className="container mx-auto py-6 px-4">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>

            <div className="space-y-4">
              <div className="text-center">
                {/* <img
                  src={userDetails.profilePic || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto"
                /> */}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 p-2 bg-gray-100 rounded-md">{userDetails.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 p-2 bg-gray-100 rounded-md">{userDetails.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 p-2 bg-gray-100 rounded-md">{userDetails.phone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 p-2 bg-gray-100 rounded-md capitalize">{userDetails.role}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 p-2 bg-gray-100 rounded-md capitalize">{userDetails.gender}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 p-2 bg-gray-100 rounded-md">
                  {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.zip},{" "}
                  {userDetails.address.country}
                </p>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default UserProfile;
