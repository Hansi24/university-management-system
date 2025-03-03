import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "../styles/Register.css";

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
    <div className="register-container">
      <h2>Course Registration Form</h2>
      <form onSubmit={handleSubmit}>
        {/*  Name in One Line */}
        <label> Name</label>
        <div className="input-group">
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        </div>

        {/* Birth Date & Gender in One Line */}
        <div className="input-group">
          <div className="input-half">
            <label>Birth Date</label>
            <input type="date" name="birthDate" onChange={handleChange} required />
          </div>
          <div className="input-half">
            <label>Gender</label>
            <select name="gender" onChange={handleChange} required>
              <option value="">Please Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <label>Address</label>
        <input type="text" name="address" placeholder="Street Address" onChange={handleChange} required />

        <label> Email</label>
        <input type="email" name="email" placeholder="example@email.com" onChange={handleChange} required />

        <label>Phone Number</label>
        <input type="tel" name="phone" placeholder="0000-000-0000" onChange={handleChange} />

        {/* Role Selection */}
        <label>Role</label>
        <div className="role-selection">
          <label>
            <input type="radio" name="role" value="Student" checked={formData.role === "Student"} onChange={handleChange} />
            Student
          </label>
          <label>
            <input type="radio" name="role" value="Lecturer" checked={formData.role === "Lecturer"} onChange={handleChange} />
            Lecturer
          </label>
        </div>

        {/* Conditionally Render Batch Field for Student */}
        {formData.role === "Student" && (
          <>
            <label>Batch</label>
            <input type="text" name="batch" placeholder="Enter Batch" onChange={handleChange} required />
          </>
        )}

        {/* Conditionally Render Profession Field for Lecturer */}
        {formData.role === "Lecturer" && (
          <>
            <label>Profession</label>
            <select name="profession" onChange={handleChange} required>
              <option value="">Please Select</option>
              <option value="Professor">Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Senior Lecturer">Senior Lecturer</option>
              <option value="Lecturer">Lecturer</option>
            </select>
          </>
        )}

        <label>Courses</label>
        <select name="courses" onChange={handleChange} required>
          <option value="">Please Select</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Civil Engineering">Civil Engineering</option>
        </select>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default Register;