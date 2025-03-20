import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import {
  ROLE_TYPES,
  StudentType,
  AdminType,
  Gender,
  LecturerType,
  USER_TYPES,
} from "../../enums/roleEnums";
import { IRegisterFormData } from "../../models/RegistraionFormData";
import { ICourse, IModule } from "../../models/Course";
import backgroundImage from "../../assets/background.jpeg";
import { CommonContext } from "../../context/commonContext";
import { useMessagePopup } from "../../context/useMessagePopup";
import { AppResponse } from "../../models/Response";
import { AuthService } from "../../service/authService";
import { CourseService } from "../../service/courseService";
import Select from "react-select";
import { FaEye } from "react-icons/fa";
import Modal from "../../reuse/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

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
  const [teachingModules, setTeachingModules] = useState<IModule[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModulesBySemester, setSelectedModulesBySemester] = useState<Record<number, string[]>>({});
  const [currentStep, setCurrentStep] = useState(1); // Track the current step

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response: AppResponse<any> = await CourseService.getAllCourse();
        if (response.success) {
          showSuccessMessage("Course fetch successfully");
          setCourses(response.data);
        } else {
          showErrorMessage(response.message || "Course fetch failed");
        }
      } catch (error) {
        console.log("Error happened in", error);
        showErrorMessage("An error occurred. Please try again.");
      } finally {
        setSpinnerOpen(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (formData.role === ROLE_TYPES.LECTURER && formData.courseId) {
      const selectedCourseDetails = courses.find((course) => course._id === formData.courseId);
      if (selectedCourseDetails) {
        const modules = selectedCourseDetails.semesters.flatMap((semester) =>
          semester.modules.map((module) => module)
        );
        setTeachingModules(modules);
      }
    }
  }, [formData.role, formData.courseId, courses]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name in formData.address) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else if (name === "role") {
      let newType;
      if (value === ROLE_TYPES.STUDENT) {
        newType = StudentType.STUDENT;
      } else if (value === ROLE_TYPES.LECTURER) {
        newType = LecturerType.LECTURER;
      } else {
        newType = "";
      }

      setFormData({
        ...formData,
        role: value as ROLE_TYPES,
        type: newType as USER_TYPES,
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
    setSelectedSemester(null);
    setTeachingModules([]);

    setFormData({
      ...formData,
      courseId,
      teachingModules: [],
    });
  };

  const options = teachingModules.map((module) => ({
    value: module._id || "",
    label: module.name || "",
  }));

  const handleSemesterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const semesterId = Number(e.target.value);
    setSelectedSemester(e.target.value);

    const selectedCourseDetails = courses.find((course) => course._id === formData.courseId);
    if (selectedCourseDetails) {
      const modules =
        selectedCourseDetails.semesters.find((semester) => semester.semesterNumber === semesterId)?.modules || [];
      setTeachingModules(modules);
    }
  };

  const handleModulesChange = (semesterNumber: number, selectedModules: string[]) => {
    setSelectedModulesBySemester((prevState) => ({
      ...prevState,
      [semesterNumber]: selectedModules,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSpinnerOpen(true);
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("address", JSON.stringify(formData.address));

    if (formData.batch) formDataToSend.append("batch", formData.batch.toString());
    if (formData.courseId) formDataToSend.append("courseId", formData.courseId);

    const moduleIds = Object.values(selectedModulesBySemester).flat();
    if (moduleIds.length > 0) formDataToSend.append("teachingModules", JSON.stringify(moduleIds));

    if (formData.profilePic) formDataToSend.append("profilePic", formData.profilePic);

    try {
      const response: AppResponse<any> = await AuthService.Register(formDataToSend);
      if (response.success) {
        showSuccessMessage("Registered successfully");
        window.location.reload();
      } else {
        showErrorMessage(response.message || "Registration failed");
      }
    } catch (error) {
      console.log("Error happened in", error);
      showErrorMessage("An error occurred. Please try again.");
    } finally {
      setSpinnerOpen(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <div
        className="flex items-center w-full bg-gray-50 h-[100%] overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col flex-grow">
          <div className="container mx-auto py-6 px-4">
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg max-h-[600px] overflow-y-auto">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                Register User (Step {currentStep} of 2)
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value={ROLE_TYPES.STUDENT}>Student</option>
                        <option value={ROLE_TYPES.LECTURER}>Lecturer</option>
                        <option value={ROLE_TYPES.ADMIN}>Admin</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Step 2: Additional Information */}
                {currentStep === 2 && (
                  <>
                    {(formData.role === ROLE_TYPES.STUDENT || formData.role === ROLE_TYPES.LECTURER) && (
                      <div>
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                          Course
                        </label>
                        <select
                          name="courseId"
                          id="courseId"
                          value={formData.courseId || ""}
                          onChange={handleCourseChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

                    {formData.role === ROLE_TYPES.STUDENT && (
                      <div>
                        <label htmlFor="batch" className="block text-sm font-medium text-gray-700">
                          Batch
                        </label>
                        <select
                          name="batch"
                          id="batch"
                          value={formData.batch || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Batch</option>
                          {Array.from({ length: 3 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    {formData.role === ROLE_TYPES.LECTURER && formData.courseId && (
                      <div>
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                          Semester
                        </label>
                        <select
                          name="semester"
                          id="semester"
                          value={selectedSemester || ""}
                          onChange={handleSemesterChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Semester</option>
                          {courses
                            .find((course) => course._id === formData.courseId)
                            ?.semesters.map((semester) => (
                              <option key={semester.semesterNumber} value={semester.semesterNumber}>
                                Semester {semester.semesterNumber}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    {formData.role === ROLE_TYPES.LECTURER && selectedSemester && (
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="teachingModules" className="block text-sm font-medium text-gray-700">
                            Teaching Modules for Semester {selectedSemester}
                          </label>
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            title="View selected modules"
                            onClick={() => setIsModalOpen(true)}
                          >
                            <FaEye />
                          </button>
                        </div>
                        <Select
                          isMulti
                          options={options}
                          value={options.filter((opt) =>
                            selectedModulesBySemester[Number(selectedSemester)]?.includes(opt.value ?? "")
                          )}
                          onChange={(selected) =>
                            handleModulesChange(
                              Number(selectedSemester),
                              selected.map((s) => s.value ?? "")
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    )}

                    {formData.role === ROLE_TYPES.ADMIN && (
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Admin Type
                        </label>
                        <select
                          name="type"
                          id="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={AdminType.ACADEMIC}>Academic</option>
                          <option value={AdminType.RESOURCE}>Resource</option>
                          <option value={AdminType.EVENT}>Event</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value={Gender.MALE}>Male</option>
                        <option value={Gender.FEMALE}>Female</option>
                        <option value={Gender.OTHER}>Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            name="street"
                            id="street"
                            placeholder="Street"
                            value={formData.address.street}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            name="city"
                            id="city"
                            placeholder="City"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            name="country"
                            id="country"
                            placeholder="Country"
                            value={formData.address.country}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < 2 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex justify-end bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Next
                    </button>
                  )}
                  {currentStep === 2 && (
                    <button
                      type="submit"
                      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Selected Modules</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 border h-7 w-7 rounded-md border-red-500 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
            {Object.entries(selectedModulesBySemester).map(([semester, moduleIds]) => (
              <div key={semester} className="mb-2">
                <h3 className="text-lg font-semibold">Semester {semester}</h3>
                <ul className="list-disc pl-5">
                  {moduleIds.map((moduleId) => {
                    const module = teachingModules.find((mod) => mod._id === moduleId);
                    return module ? <li key={moduleId}>{module.name}</li> : null;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};

export default Register;