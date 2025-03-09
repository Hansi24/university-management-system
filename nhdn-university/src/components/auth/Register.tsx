import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  ROLE_TYPES,
  StudentType,
  AdminType,
  Gender,
} from "../../enums/roleEnums";
import { IRegisterFormData } from "../../models/RegistraionFormData";
import { ICourse } from "../../models/Course";
import backgroundImage from "../../assets/background.jpeg";
import ASideBar from "../pages/Admin/ASideBar";
import TitleBar from "../layout/TitleBar";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<IRegisterFormData>({
    name: "",
    email: "",
    phone: "",
    role: ROLE_TYPES.STUDENT,
    type: StudentType.STUDENT,
    gender: Gender.MALE,
    address: {
      street: "",
      city: "",
      zip: "",
      country: "",
    },
  });

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [teachingModules, setTeachingModules] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // useEffect(() => {
  //   // Fetch all courses for students and lecturers
  //   const fetchCourses = async () => {
  //     try {
  //       const response = await axios.get('/api/courses');
  //       setCourses(response.data);
  //     } catch (error) {
  //       console.error('Error fetching courses:', error);
  //     }
  //   };
  //   fetchCourses();
  // }, []);

  // useEffect(() => {
  //   // If the role is lecturer, populate the teaching modules
  //   if (formData.role === ROLE_TYPES.LECTURER && selectedCourse) {
  //     const selectedCourseDetails = courses.find(course => course._id === selectedCourse);
  //     if (selectedCourseDetails) {
  //       const modules = selectedCourseDetails.semesters
  //         .flatMap(semester => semester.modules.map(module => module.name));
  //       setTeachingModules(modules);
  //     }
  //   }
  // }, [formData.role, selectedCourse, courses]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle address fields specifically
    if (name in formData.address) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setFormData({
      ...formData,
      courseId,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append form data to FormData object for file upload
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("address", JSON.stringify(formData.address)); // You may need to handle this server-side
    if (formData.batch)
      formDataToSend.append("batch", formData.batch.toString());
    if (formData.courseId) formDataToSend.append("courseId", formData.courseId);
    if (formData.teachingModules)
      formDataToSend.append(
        "teachingModules",
        JSON.stringify(formData.teachingModules)
      );
    if (formData.profilePic)
      formDataToSend.append("profilePic", formData.profilePic);

    try {
      const response = await axios.post("/api/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("User registered successfully");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Error registering user");
    }
  };

  return (
    <div
      className="flex w-full min-h-screen bg-gray-50"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ASideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="container mx-auto py-6 px-4">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
              Register User
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-sm"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-sm"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-sm"
                  required
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-sm"
                  required
                >
                  <option value={ROLE_TYPES.STUDENT}>Student</option>
                  <option value={ROLE_TYPES.LECTURER}>Lecturer</option>
                  <option value={ROLE_TYPES.ADMIN}>Admin</option>
                </select>
              </div>

              {/* Course (only for students and lecturers) */}
              {(formData.role === ROLE_TYPES.STUDENT ||
                formData.role === ROLE_TYPES.LECTURER) && (
                <div className="mb-4">
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Course
                  </label>
                  <select
                    name="courseId"
                    id="courseId"
                    value={formData.courseId || ""}
                    onChange={handleCourseChange}
                    className="w-full p-2 border rounded-md shadow-sm"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Teaching Modules (only for lecturers) */}
              {formData.role === ROLE_TYPES.LECTURER && formData.courseId && (
                <div className="mb-4">
                  <label
                    htmlFor="teachingModules"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Teaching Modules
                  </label>
                  <select
                    name="teachingModules"
                    id="teachingModules"
                    multiple
                    value={formData.teachingModules || []}
                    onChange={(e) => {
                      const selectedOptions = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setFormData({
                        ...formData,
                        teachingModules: selectedOptions,
                      });
                    }}
                    className="w-full p-2 border rounded-md shadow-sm"
                    required
                  >
                    {teachingModules.map((module, index) => (
                      <option key={index} value={module}>
                        {module}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Admin Type (only for admins) */}
              {formData.role === ROLE_TYPES.ADMIN && (
                <div className="mb-4">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Admin Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md shadow-sm"
                  >
                    <option value={AdminType.ACADEMIC}>Academic</option>
                    <option value={AdminType.RESOURCE}>Resource</option>
                    <option value={AdminType.EVENT}>Event</option>
                  </select>
                </div>
              )}

              {/* Gender */}
              <div className="mb-4">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-sm"
                  required
                >
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.OTHER}>Other</option>
                </select>
              </div>

              {/* Address */}
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
              <div className="flex gap-5">
                <div>
                <input
                  type="text"
                  name="street"
                  id="street"
                  placeholder="Street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-sm"
                />
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-sm mt-2"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="zip"
                  id="zip"
                  placeholder="Zip Code"
                  value={formData.address.zip}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-sm"
                />
                <input
                  type="text"
                  name="country"
                  id="country"
                  placeholder="Country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md shadow-sm mt-2"
                />
              </div>
              </div>
              </div>

              {/* Profile Picture (Optional) */}
              <div className="mb-4">
                <label
                  htmlFor="profilePic"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="profilePic"
                  id="profilePic"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profilePic: e.target.files?.[0],
                    })
                  }
                  className="w-full p-2 border rounded-md shadow-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
