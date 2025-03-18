import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaClipboardCheck, FaPlus } from "react-icons/fa";
import { AppResponse } from "../../../models/Response";
import { ModuleService } from "../../../service/moduleService";
import { IModuleMaterial, ModuleMaterialType } from "../../../models/Material";
import { ROLE_TYPES } from "../../../enums/roleEnums";

const ModulePage = () => {
  const { id } = useParams(); // moduleId
  const navigate = useNavigate();
  const [moduleMaterials, setModuleMaterials] = useState<IModuleMaterial[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [materialType, setMaterialType] = useState<ModuleMaterialType>(ModuleMaterialType.LECTURE);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");
  const [materialFileUrl, setMaterialFileUrl] = useState("");
  const [materialDueDate, setMaterialDueDate] = useState("");
  const userRole = localStorage.getItem("UserRole");

  // Fetch module materials
  useEffect(() => {
    const fetchModuleMaterials = async () => {
      try {
        if (!id) return;
        const response: AppResponse<IModuleMaterial[]> = await ModuleService.getModuleDetails(id);
        if (response.success) {
          setModuleMaterials(response.data);
        }
      } catch (error) {
        console.error("Error fetching module materials:", error);
      }
    };

    fetchModuleMaterials();
  }, [id]);

  // Open the create modal
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Close the create modal
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    resetForm(); // Reset form fields when modal is closed
  };

  // Reset form fields
  const resetForm = () => {
    setMaterialType(ModuleMaterialType.LECTURE);
    setMaterialTitle("");
    setMaterialDescription("");
    setMaterialFileUrl("");
    setMaterialDueDate("");
  };

  // Handle material type selection
  const handleMaterialTypeChange = (type: ModuleMaterialType) => {
    setMaterialType(type);
  };

  // Handle form submission
  const handleCreateMaterial = async () => {
    try {
      if (!id) {
        alert("Module ID is missing.");
        return;
      }

      const materialData: IModuleMaterial = {
        title: materialTitle,
        description: materialDescription,
        type: materialType,
        moduleId: id,
        fileUrl: materialFileUrl,
        dueDate: materialType === ModuleMaterialType.ASSIGNMENT ? new Date(materialDueDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response: AppResponse<IModuleMaterial> = await ModuleService.createMaterial(materialData);
      if (response.success) {
        alert("Material created successfully!");
        closeCreateModal();
        // Update moduleMaterials with the new material
        setModuleMaterials((prev) => [...prev, response.data]);
      } else {
        alert("Failed to create material.");
      }
    } catch (error) {
      console.error("Error creating material:", error);
      alert("An error occurred while creating the material.");
    }
  };

  if (!moduleMaterials) return <div>Loading...</div>;

  // Filter materials by type
  const lectures = moduleMaterials.filter((material) => material.type === ModuleMaterialType.LECTURE);
  const assignments = moduleMaterials.filter((material) => material.type === ModuleMaterialType.ASSIGNMENT);

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <div className="flex flex-col flex-grow">
        <div className="m-6">
          {/* Back Button */}
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-fit"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" /> Back to Semester
          </button>

          {/* Module Title */}
          <h2 className="text-2xl font-bold mt-6 text-gray-700">📘 Module Materials</h2>

          {/* Create Button (Visible only for Lecturers) */}
          {userRole === ROLE_TYPES.LECTURER && (
            <button
              className="flex items-center bg-green-600 text-white px-4 py-2 mt-6 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 w-fit"
              onClick={openCreateModal}
            >
              <FaPlus className="mr-2" /> Create
            </button>
          )}

          {/* Lectures Section */}
          <h3 className="text-xl font-semibold mt-6 text-gray-600">📖 Lectures</h3>
          {lectures.length > 0 ? (
            <div className="mt-4 space-y-4">
              {lectures.map((lecture, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white p-4 cursor-pointer rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate(`/module/${id}/materials/${lecture._id}`)} // Navigate to Material Details
                >
                  <div className="flex items-center text-lg font-semibold">
                    <FaBookOpen className="text-blue-600 mr-3" />
                    {lecture.title}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-gray-500">No lectures available.</div>
          )}

          {/* Assignments Section */}
          <h3 className="text-xl font-semibold mt-6 text-gray-600">📝 Assignments</h3>
          {assignments.length > 0 ? (
            <div className="space-y-4 mt-4">
              {assignments.map((assignment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between cursor-pointer bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate(`/module/${id}/materials/${assignment._id}`)} // Navigate to Material Details
                >
                  <div className="flex items-center text-lg font-semibold">
                    <FaClipboardCheck className="text-green-600 mr-3" />
                    {assignment.title}
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-gray-500">No assignments available.</div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Create New Material</h2>
            <div className="space-y-4">
              {/* Material Type Selection */}
              <div className="flex space-x-4">
                <button
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    materialType === ModuleMaterialType.LECTURE
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleMaterialTypeChange(ModuleMaterialType.LECTURE)}
                >
                  Lecture
                </button>
                <button
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    materialType === ModuleMaterialType.ASSIGNMENT
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleMaterialTypeChange(ModuleMaterialType.ASSIGNMENT)}
                >
                  Assignment
                </button>
              </div>

              {/* Title Input */}
              <input
                type="text"
                placeholder="Title"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              {/* Description Input */}
              <textarea
                placeholder="Description"
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              {/* File URL Input */}
              <input
                type="text"
                placeholder="File URL"
                value={materialFileUrl}
                onChange={(e) => setMaterialFileUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              {/* Due Date Input (Only for Assignments) */}
              {materialType === ModuleMaterialType.ASSIGNMENT && (
                <input
                  type="date"
                  value={materialDueDate}
                  onChange={(e) => setMaterialDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              )}

              {/* Create Button */}
              <button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                onClick={handleCreateMaterial}
              >
                Create
              </button>

              {/* Cancel Button */}
              <button
                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                onClick={closeCreateModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulePage;