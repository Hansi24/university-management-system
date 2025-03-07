import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import backgroundImage from "../../assets/background.jpeg";
import ASideBar from "../pages/Admin/ASideBar";
import TitleBar from "../layout/TitleBar";

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  address: string;
  email: string;
  phone: string;
  role: string;
  profession: string;
  batch: string;
  courses: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    address: "",
    email: "",
    phone: "",
    role: "Student",
    profession: "",
    batch: "",
    courses: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/register", formData);
      alert("Registration successful!");
    } catch (error: any) {
      alert("Registration failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <ASideBar />
    <div className="flex flex-col flex-grow">
      <TitleBar />
      <div className="flex flex-grow justify-center items-center p-6">
      <div className="w-1000 bg-white p-8 rounded-xl shadow-xl text-black space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">Course Registration Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Name in One Line */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium">Middle Name</label>
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Birth Date & Gender in One Line */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                name="gender"
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              >
                <option value="">Please Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md mb-6"
          />

          {/* Email */}
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md mb-6"
          />

          {/* Phone Number */}
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="0000-000-0000"
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md mb-6"
          />

          {/* Role Selection */}
          <label className="block text-sm font-medium mb-2">Role</label>
          <div className="flex gap-6 mb-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="Student"
                checked={formData.role === "Student"}
                onChange={handleChange}
                className="mr-2"
              />
              Student
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="Lecturer"
                checked={formData.role === "Lecturer"}
                onChange={handleChange}
                className="mr-2"
              />
              Lecturer
            </label>
          </div>

          {/* Conditionally Render Batch Field for Student */}
          {formData.role === "Student" && (
            <>
              <label className="block text-sm font-medium">Batch</label>
              <input
                type="text"
                name="batch"
                placeholder="Enter Batch"
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md mb-6"
              />
            </>
          )}

          {/* Conditionally Render Profession Field for Lecturer */}
          {formData.role === "Lecturer" && (
            <>
              <label className="block text-sm font-medium">Profession</label>
              <select
                name="profession"
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md mb-6"
              >
                <option value="">Please Select</option>
                <option value="Professor">Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Senior Lecturer">Senior Lecturer</option>
                <option value="Lecturer">Lecturer</option>
              </select>
            </>
          )}

          {/* Courses Selection */}
          <label className="block text-sm font-medium">Courses</label>
          <select
            name="courses"
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md mb-6"
          >
            <option value="">Please Select</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
      </div>
    </div>
    </div>
  );
};

export default Register;
