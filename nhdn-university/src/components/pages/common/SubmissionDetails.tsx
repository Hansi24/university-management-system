import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ModuleService } from "../../../service/moduleService";
import { IAssignmentSubmission } from "../../../models/Assignment";

const SubmissionDetails = () => {
  const { id, materialId, submissionId } = useParams(); // moduleId, materialId, submissionId
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<IAssignmentSubmission>();

  // Fetch submission details
  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        if (!submissionId) return;
        const response = await ModuleService.getSubmissionDetails(submissionId);
        if (response.success) {
          setSubmission(response.data);
        }
      } catch (error) {
        console.error("Error fetching submission details:", error);
      }
    };

    fetchSubmissionDetails();
  }, [submissionId]);

  if (!submission) return <div>Loading...</div>;

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      <div className="flex flex-col flex-grow">
        <div className="m-6">
          {/* Back Button */}
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-fit"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" /> Back to Submissions
          </button>

          {/* Submission Details */}
          <h2 className="text-2xl font-bold mt-6 text-gray-700">📝 Submission Details</h2>
          <div className="mt-6 space-y-4">
            <p className="text-gray-600">Student: {typeof submission.studentId === 'object' ? submission.studentId.name : submission.studentId}</p>
            <p className="text-gray-600">Submission Link: <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.fileUrl}</a></p>
            <p className="text-gray-600">Submitted At: {new Date(submission.submissionDate).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;