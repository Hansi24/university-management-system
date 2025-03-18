import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaCheck, FaFileUpload } from "react-icons/fa";
import { AppResponse } from "../../../models/Response";
import { ModuleService } from "../../../service/moduleService";
import { IModuleMaterial, ModuleMaterialType } from "../../../models/Material";
import { ROLE_TYPES } from "../../../enums/roleEnums";
import { IAssignmentSubmission } from "../../../models/Assignment";

const MaterialDetails = () => {
  const { id, materialId } = useParams(); // moduleId and materialId
  const navigate = useNavigate();
  const [material, setMaterial] = useState<IModuleMaterial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [studentSubmissions, setStudentSubmissions] = useState<IAssignmentSubmission[]>([]);
  const userRole = localStorage.getItem("UserRole");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Fetch material details
  useEffect(() => {
    const fetchMaterialDetails = async () => {
      try {
        if (!id || !materialId) return;
        const response: AppResponse<IModuleMaterial> = await ModuleService.getMaterialDetails(materialId);
        if (response.success) {
          setMaterial(response.data);
          setTitle(response.data.title);
          setDescription(response.data.description || "");
          setFileUrl(response.data.fileUrl || "");
          setDueDate(response.data.dueDate?.toISOString().split("T")[0] || "");
        }
      } catch (error) {
        console.error("Error fetching material details:", error);
      }
    };

    fetchMaterialDetails();
  }, [id, materialId]);

  // Fetch student submissions (for assignments)
  useEffect(() => {
    if (material?.type === ModuleMaterialType.ASSIGNMENT && userRole === ROLE_TYPES.LECTURER) {
      const fetchSubmissions = async () => {
        try {
          const response: AppResponse<IAssignmentSubmission[]> = await ModuleService.getSubmissions(materialId!);
          if (response.success) {
            setStudentSubmissions(response.data);
          }
        } catch (error) {
          console.error("Error fetching submissions:", error);
        }
      };

      fetchSubmissions();
    }
  }, [material, materialId, userRole]);

  useEffect(() => {
    const fetchStudentSubmissionStatus = async () => {
      try {
        if (userRole === ROLE_TYPES.STUDENT && materialId) {
          const response: AppResponse<boolean> = await ModuleService.hasStudentSubmitted(materialId);
          if (response.success) {
            setHasSubmitted(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching student submission status:", error);
      }
    };
  
    fetchStudentSubmissionStatus();
  }, [materialId, userRole]);

  // Handle edit toggle
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      if (!materialId) return;
      const updatedMaterial: IModuleMaterial = {
        ...material!,
        title,
        description,
        fileUrl,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      };

      const response: AppResponse<IModuleMaterial> = await ModuleService.updateMaterial(materialId, updatedMaterial);
      if (response.success) {
        setMaterial(response.data);
        setIsEditing(false);
        alert("Material updated successfully!");
      }
    } catch (error) {
      console.error("Error updating material:", error);
      alert("Failed to update material.");
    }
  };

  // Handle assignment submission
  const handleSubmitAssignment = async () => {
    try {
      if (!materialId) return;
      const submissionData = {
        assignmentId: materialId,
        fileUrl: submissionLink,
      };

      const response: AppResponse<IAssignmentSubmission> = await ModuleService.submitAssignment(submissionData);
      if (response.success) {
        alert("Assignment submitted successfully!");
        setSubmissionLink("");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to submit assignment.");
    }
  };

  if (!material) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <div className="flex flex-col flex-grow">
        <div className="m-6">
          {/* Back Button */}
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-fit"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" /> Back to Module
          </button>

          {/* Material Title */}
          <h2 className="text-2xl font-bold mt-6 text-gray-700">📘 {material.title}</h2>

          {/* Edit Button (Visible only for Lecturers) */}
          {userRole === ROLE_TYPES.LECTURER && (
            <button
              className="flex items-center bg-green-600 text-white px-4 py-2 mt-6 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 w-fit"
              onClick={toggleEdit}
            >
              <FaEdit className="mr-2" /> {isEditing ? "Cancel Edit" : "Edit"}
            </button>
          )}

          {/* Material Details */}
          <div className="mt-6 space-y-4">
            {/* Title */}
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            ) : (
              <h3 className="text-xl font-semibold text-gray-600">{material.title}</h3>
            )}

            {/* Description */}
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            ) : (
              <p className="text-gray-600">{material.description}</p>
            )}

            {/* File URL */}
            {isEditing ? (
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            ) : (
              material.fileUrl && (
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download File
                </a>
              )
            )}

            {/* Due Date (Only for Assignments) */}
            {material.type === ModuleMaterialType.ASSIGNMENT && (
              <>
                {isEditing ? (
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                ) : (
                  <p className="text-gray-600">Due Date: {new Date(material.dueDate!).toLocaleDateString()}</p>
                )}
              </>
            )}

            {/* Save Changes Button (Visible only in Edit Mode) */}
            {isEditing && (
              <button
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-fit"
                onClick={handleSaveChanges}
              >
                <FaCheck className="mr-2" /> Save Changes
              </button>
            )}
          </div>

          {/* Assignment Submission (Visible only for Students) */}
          {/* {userRole === ROLE_TYPES.STUDENT && material.type === ModuleMaterialType.ASSIGNMENT && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-600">📝 Submit Assignment</h3>
              <input
                type="text"
                placeholder="Enter submission link"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                className="flex items-center bg-green-600 text-white px-4 py-2 mt-4 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 w-fit"
                onClick={handleSubmitAssignment}
                disabled={!submissionLink}
              >
                <FaFileUpload className="mr-2" /> Submit
              </button>
            </div>
          )} */}
          {userRole === ROLE_TYPES.STUDENT && material.type === ModuleMaterialType.ASSIGNMENT && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-600">📝 Submit Assignment</h3>
              <input
                type="text"
                placeholder="Enter submission link"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className={`w-full px-4 py-2 ${hasSubmitted && "hidden"} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                disabled={hasSubmitted}
              />
              <button
                className="flex items-center bg-green-600 text-white px-4 py-2 mt-4 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 w-fit"
                onClick={handleSubmitAssignment}
                disabled={hasSubmitted}
              >
                <FaFileUpload className="mr-2" /> {hasSubmitted ? "Submitted" : "Submit"}
              </button>
            </div>
          )}

          {/* Student Submissions (Visible only for Lecturers) */}
          {userRole === ROLE_TYPES.LECTURER && material.type === ModuleMaterialType.ASSIGNMENT && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-600">📝 Student Submissions</h3>
              {studentSubmissions.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {studentSubmissions.map((submission, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center text-lg font-semibold">
                        <span className="text-gray-700">{typeof submission.studentId === 'string' ? submission.studentId : submission.studentId.name}</span>
                      </div>
                      <button
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                        onClick={() => navigate(`/module/${id}/materials/${materialId}/submissions/${submission._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-gray-500">No submissions yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetails;