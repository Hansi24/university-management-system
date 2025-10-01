import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CommonContext } from "../../../context/commonContext";
import { useMessagePopup } from "../../../context/useMessagePopup";
import { AuthService } from "../../../service/authService";
import { AppResponse } from "../../../models/Response";
import { IUsers } from "../../../models/RegistraionFormData";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkedAlt, FaGraduationCap } from "react-icons/fa"; // FontAwesome Icons
import { HiOutlineAcademicCap, HiOutlineCode } from "react-icons/hi"; // HeroIcons
import backgroundImage from "../../../assets/background.jpeg";
import SideBar from "../../layout/SideBar";
import TitleBar from "../../layout/TitleBar";

const UserProfile: React.FC = () => {
  const [userDetails, setUserDetails] = useState<IUsers | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { showErrorMessage } = useMessagePopup();
  const navigate = useNavigate();

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

  // Handle profilePic
  const imageSrc =
    typeof userDetails.profilePic === "string"
      ? userDetails.profilePic
      : "https://via.placeholder.com/150"; // Fallback image

  return (
    <div
      className="flex w-full min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
     
        <div className="container mx-auto py-6 px-4 flex justify-center">
          <div className="max-w-5xl w-full bg-white p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Section: Profile Picture and Registered ID */}
              <div className="md:col-span-1 flex flex-col items-center bg-gradient-to-b from-gray-500 to-gray-300 text-white p-6 rounded-xl shadow-lg">
                <div
                  className="w-52 h-52 bg-gray-500 mb-4 border-2 border-black rounded-full"
                  style={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="w-full bg-gray-100 p-4 rounded-md text-center text-brown-900">
                  <h3 className="font-semibold">Registered ID</h3>
                  <p className="mt-2 text-lg font-medium">{userDetails.regId}</p>
                </div>
              </div>

              {/* Right Section: Personal and Academic Information */}
              <div className="md:col-span-2">
                {/* Personal Information */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-lg mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <FaUser className="mr-2 text-blue-600" /> Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Name</label>
                      <p className="mt-1 p-4 bg-gray-100 rounded-md">{userDetails.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1 p-4 bg-gray-100 rounded-md">{userDetails.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Phone</label>
                      <p className="mt-1 p-4 bg-gray-100 rounded-md">{userDetails.phone}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Gender</label>
                      <p className="mt-1 p-4 bg-gray-100 rounded-md">{userDetails.gender}</p>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Address</label>
                      <p className="mt-1 p-4 bg-gray-100 rounded-md">
                        {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.zip},{" "}
                        {userDetails.address.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <FaGraduationCap className="mr-2 text-green-600" /> Academic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Role</label>
                      <p className="mt-1 p-4 bg-gray-100 rounded-md">{userDetails.role}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Course</label>
                      <p className="mt-1 p-4 bg-gray-100 rounded-md">
                        {typeof userDetails.courseId === "string"
                          ? userDetails.courseId
                          : userDetails.courseId?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Teaching Modules</label>
                      <p className="mt-1 p-4 bg-gray-100 rounded-md">
                        {userDetails.teachingModules?.join(", ")}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Enrolled Modules</label>
                      <p className="mt-1 p-4 bg-gray-100 rounded-md">
                        {userDetails.enrolledModules?.join(", ") || "No enrolled modules"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
  
  );
};

export default UserProfile;
