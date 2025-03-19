import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import universityLogo from '../../assets/university-logo.png';
import { AppResponse } from '../../models/Response';
import { AuthService } from '../../service/authService';
import { useTokenContext } from '../../context/TokenContext';
import { useMessagePopup } from '../../context/useMessagePopup';
import { Util } from '../../utils/util';
import { ROLE_TYPES } from '../../enums/roleEnums';
import { CommonContext } from '../../context/commonContext';
import backgroundImage from "../../assets/background.jpeg";
import backgroundVideo from "../../assets/background.mp4"; // Import the video file

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    regId: "",
    password: "",
  });
  const { setToken } = useTokenContext();
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpinnerOpen(true);
    try {
      const response: AppResponse<any> = await AuthService.Login(formData);
      if (response.success) {
        showSuccessMessage("User logged in successfully");
        Util.setToken(response.data.token);
        setToken(response.data.token);
        if (ROLE_TYPES.STUDENT === Util.getRole() || ROLE_TYPES.LECTURER === Util.getRole()) {
          navigate("/event-dashboard");
        } else if (ROLE_TYPES.ADMIN === Util.getRole()) {
          console.log(Util.getRole());
          navigate("/admin-dashboard");
        }
      } else {
        showErrorMessage(response.message || "Login failed");
      }
    } catch (error) {
      console.log("Error logging in", error);
      showErrorMessage("An error occurred. Please try again.");
    } finally {
      setSpinnerOpen(false);
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Side (3/5 of the screen) - Background Image */}
      <div
        className="w-3/5 h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Optional: Add a video background here if needed */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

     {/* Right Side (2/5 of the screen) - Login Form */}
<div className="w-2/5 h-full flex justify-center items-center bg-gray-700">
  <div className="p-10 rounded-xl shadow-lg text-center w-full max-w-[400px] border-2 border-gray-200 bg-blue-50">
    <img src={universityLogo} alt="University Logo" className="w-32 h-32 mx-auto mb-5" />
    <h2 className="text-2xl text-gray-800 mb-2">University Management System</h2>
    <h3 className="text-lg text-gray-600 mb-5">Login</h3>
    <form onSubmit={handleLogin}>
      <div className="flex flex-col gap-4 mb-5">
        <input
          type="text"
          placeholder="Registrant No"
          name="regId"
          value={formData.regId}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gray-900 text-white p-3 rounded-md text-lg hover:bg-gray-600 transition duration-300"
      >
        Login
      </button>
    </form>
    <div className="mt-4 text-sm">
      <a href="/forgot-password" className="text-blue-500 hover:underline">
        Forgot Password?
      </a>
    </div>
  </div>
</div>
    </div>
  );
};

export default Login;