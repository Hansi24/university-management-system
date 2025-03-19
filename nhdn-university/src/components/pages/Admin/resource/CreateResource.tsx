import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { IResource, ResourceType } from "../../../../models/Resource";
import { ResourceService } from "../../../../service/resourceService";
import TitleBar from "../../../layout/TitleBar";
import ASideBar from "../ASideBar";

const CreateResource: React.FC = () => {
  const { register, handleSubmit, watch, reset } = useForm<IResource>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IResource> = async (data) => {
    setLoading(true);
    try {
      const response = await ResourceService.createResource(data);
      if (response.success) {
        showSuccessMessage("Resource created successfully.");
        reset();
      } else {
        showErrorMessage(response.message || "Failed to create resource.");
      }
    } catch (error) {
      console.error("Error creating resource:", error);
      showErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedType = watch("type");

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* <ASideBar /> */}
      <div className="flex flex-col flex-grow">
        {/* <TitleBar /> */}
        <div className="flex justify-center items-center py-10">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Create Resource
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter resource name"
                />
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type
                </label>
                <select
                  id="type"
                  {...register("type", { required: true })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  {Object.values(ResourceType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Fields */}
              {selectedType === ResourceType.CLASSROOM ||
              selectedType === ResourceType.LAB ||
              selectedType === ResourceType.AUDITORIUM ? (
                <>
                  <div>
                    <label
                      htmlFor="building"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Building
                    </label>
                    <input
                      id="building"
                      type="text"
                      {...register("building", { required: true })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter building name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="floor"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Floor
                    </label>
                    <input
                      id="floor"
                      type="number"
                      {...register("floor", { required: true })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter floor number"
                    />
                  </div>
                </>
              ) : null}

              {selectedType === ResourceType.VEHICLE && (
                <div>
                  <label
                    htmlFor="vehicleNo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Vehicle No
                  </label>
                  <input
                    id="vehicleNo"
                    type="text"
                    {...register("vehicleNo", { required: true })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter vehicle number"
                  />
                </div>
              )}

              {selectedType === ResourceType.EQUIPMENT && (
                <>
                  <div>
                    <label
                      htmlFor="count"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Count
                    </label>
                    <input
                      id="count"
                      type="number"
                      {...register("count", { required: true })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter equipment count"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="equipments"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Equipments
                    </label>
                    <input
                      id="equipments"
                      type="text"
                      {...register("equipments", { required: true })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter equipment details"
                    />
                  </div>
                </>
              )}

              {/* Code */}
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code
                </label>
                <input
                  id="code"
                  type="text"
                  {...register("code", { required: true })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter resource code"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create Resource"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResource;

function showSuccessMessage(message: string) {
  alert(message); // Replace with a proper toast notification
}

function showErrorMessage(message: string) {
  alert(message); // Replace with a proper toast notification
}