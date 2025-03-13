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


const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    regId: "",
    password: "",
  });
  const { setToken } = useTokenContext();
  const { setSpinnerOpen} = useContext(CommonContext);
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
      const response:AppResponse<any> = await AuthService.Login(formData);
      console.log(response.success)
      if (response.success) {
        showSuccessMessage("User logged in successfully");
        console.log(response.data.token);
        Util.setToken(response.data.token);
        setToken(response.data.token);
        if(ROLE_TYPES.STUDENT === Util.getRole() || ROLE_TYPES.LECTURER === Util.getRole()){
          navigate("/event-dashboard");
        }
        else if(ROLE_TYPES.ADMIN === Util.getRole()){
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
    <div className="flex justify-center items-center w-full h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="bg-white p-10 rounded-xl shadow-lg text-center w-[500px]">
        <img src={universityLogo} alt="University Logo" className="w-48 h-48 mx-auto mb-5" />
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
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md text-lg hover:bg-blue-600 transition duration-300">Login</button>
        </form>
        <div className="mt-4 text-sm">
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
