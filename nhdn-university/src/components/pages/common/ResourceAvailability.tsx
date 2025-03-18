import React, { useState, useEffect, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CommonContext } from "../../../context/commonContext";
import { useMessagePopup } from "../../../context/useMessagePopup";
import { IResource, ResourceType } from "../../../models/Resource";
import { IResourceBooking } from "../../../models/ResourceBooking";
import { AppResponse } from "../../../models/Response";
import { ResourceService } from "../../../service/resourceService";
// import SideBar from "../../layout/SideBar";
// import TitleBar from "../../layout/TitleBar";
import backgroundImage from "../../../assets/background.jpeg";

const ResourceAvailability: React.FC = () => {
  const [resources, setResources] = useState<IResource[]>([]);
  const [availableResources, setAvailableResources] = useState<IResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<IResource | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();
  const { register, handleSubmit, reset  } = useForm<IResourceBooking>();

  useEffect(() => {
    // Fetch all resources when the component loads
    const fetchResources = async () => {
      try {
        const response: AppResponse<IResource[]> = await ResourceService.getAllResource();
        if (response.success) {
          showSuccessMessage("Resources fetched successfully");
          setResources(response.data);
        } else {
          showErrorMessage(response.message || "Failed to fetch resources");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        showErrorMessage("An error occurred. Please try again.");
      } finally {
        setSpinnerOpen(false);
      }
    };
    fetchResources();
  }, []);

  // Function to filter available resources based on selected time
  const filterAvailableResources = async () => {
    if (!startTime || !endTime) {
      showErrorMessage("Please select start and end time first.");
      return;
    }

    try {
      const response: AppResponse<IResource[]> = await ResourceService.getAvailableResources(startTime, endTime);
      if (response.success) {
        setAvailableResources(response.data);
        showSuccessMessage("Available resources updated.");
      } else {
        showErrorMessage(response.message || "Failed to fetch available resources.");
      }
    } catch (error) {
      console.error("Error fetching available resources:", error);
      showErrorMessage("An error occurred. Please try again.");
    }
  };

  // Handles booking request submission
  const onSubmit: SubmitHandler<IResourceBooking> = async (data) => {
    setSpinnerOpen(true);
    try {
      const response: AppResponse<IResourceBooking> = await ResourceService.resourceRequest(data);
      if (response.success) {
        showSuccessMessage("Your booking request has been sent successfully.");
      } else {
        showErrorMessage(response.message || "Failed to send booking request.");
      }
    } catch (error) {
      console.error("Error submitting booking request:", error);
      showErrorMessage("An error occurred. Please try again.");
    } finally {
      setSpinnerOpen(false);
      setShowPopup(false);
      reset();
    }
  };

  return (
    <div
      className="flex w-full min-h-screen bg-gray-100"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}
    >
      {/* <SideBar /> */}
      <div className="flex flex-col w-full">
        {/* <TitleBar /> */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Resource Availability</h2>

            {/* Start & End Time Selection */}
            <div className="flex gap-4 justify-center mb-6">
              <input
                type="datetime-local"
                className="px-4 py-2 rounded-lg shadow-md"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <input
                type="datetime-local"
                className="px-4 py-2 rounded-lg shadow-md"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min={startTime}
                disabled={!startTime}
              />
              <button
                onClick={filterAvailableResources}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Check Availability
              </button>
            </div>

            {/* Resource List */}
            <div className="border rounded-lg overflow-hidden shadow-md">
              <table className="w-full border-collapse">
                <tbody>
                  {availableResources.map((resource) => (
                    <tr
                      key={resource._id}
                      className={`border-b hover:bg-green-200 ${
                        !resource.availability ? "bg-red-500 cursor-not-allowed" : ""
                      }`}
                      onClick={() => resource.availability && setSelectedResource(resource)}
                    >
                      <td className="p-3 text-lg cursor-pointer flex items-center">
                        {selectedResource?._id === resource._id && (
                          <span className="mr-2 text-green-500">✔</span>
                        )}
                        <span className={`${!resource.availability ? "text-white" : "text-black"}`}>
                          ({resource.code}) {resource.name}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Book Resource Button */}
            {selectedResource && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowPopup(true)}
                  className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-6 rounded-full shadow-lg transition-all duration-300"
                >
                  Book Resource
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Requesting {selectedResource?.name}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" {...register("resourceId")} value={selectedResource?._id} />
              <input type="text" {...register("subject")} placeholder="Subject" className="w-full p-3 border rounded-md mb-2" />
              <textarea {...register("description")} placeholder="Description" className="w-full p-3 border rounded-md mb-2" />
              <input type="hidden" {...register("startTime")} value={startTime} />
              <input type="hidden" {...register("endTime")} value={endTime} />

              <div className="flex justify-between">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Request</button>
                <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceAvailability;
