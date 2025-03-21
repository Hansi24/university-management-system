import { IModuleMaterial } from "../modal/IModuleMaterial";
import { ModuleMaterial } from "../schema/ModuleMaterial";
import { ObjectId, Types } from 'mongoose';
import { User } from "../schema/User";
import { Role } from "../enums/UserEnums";
import Course from "../schema/Course";
import { IAssignmentSubmission, SubmissionStatus } from '../modal/IAssignmentSubmission';
import { AssignmentSubmission } from "../schema/AssignmentSubmission";
import { getUserByIdDao } from "./user-dao";
import { sendSubmissionReceivedEmail } from "../email/sendSubmissionReceivedEmail";
import { sendMaterialNotificationEmail } from "../email/sendCreateModuleMaterial";


export const createMaterialDao = async (material: IModuleMaterial, lecturer: Types.ObjectId): Promise<IModuleMaterial> => {
  try {
      const moduleId = new Types.ObjectId(material.moduleId);

      // Check if the module exists in any course
      const existingModule = await Course.findOne({ "semesters.modules._id": moduleId });
      if (!existingModule) {
          throw new Error("Module does not exist in any course.");
      }

      // Check if the lecturer is assigned to the module
      if (!isLecturerAssignedToModule(lecturer, moduleId)) {
          throw new Error("Lecturer is not assigned to this module.");
      }

      // Create and save the new material
      const newMaterial = new ModuleMaterial(material);
      await newMaterial.save();

      // Send email notification to all enrolled users
      await sendMaterialNotificationEmail(newMaterial, moduleId);

      return newMaterial;
  } catch (error) {
      console.error("Error creating material:", error);
      throw error;
  }
};

export const UpdateMaterialDao = async (updates: Partial<IModuleMaterial>, lecturer:Types.ObjectId, materialId: string): Promise<IModuleMaterial> => {
    try {
        const existingMaterialId = new Types.ObjectId(materialId);
        const existingMaterial = await ModuleMaterial.findById(existingMaterialId);
        if (!existingMaterial) {
            throw new Error("Module Material not found");
        }
        if(!isLecturerAssignedToModule(lecturer, existingMaterial.moduleId)){
            throw new Error("Lecturer is not assigned to this module.");
        }
        const updatedMaterial = await ModuleMaterial.findByIdAndUpdate(
            existingMaterialId,
            updates,
            { new: true }
        );
        if (!updatedMaterial) {
            throw new Error("Failed to update module material.");
        }
        return updatedMaterial;
    } catch (error) {
        throw error;
    }
};

export const getMaterialByIdDao = async (materialId: string): Promise<IModuleMaterial> => {
    try {
      const id = new Types.ObjectId(materialId);
      const material = await ModuleMaterial.findById(id);
  
      if (!material) {
        throw new Error("Module Material not found");
      }
    
      return material;
    } catch (error) {
      console.error("Error deleting Module Material:", error);
      throw error;
    }
};
export const deleteModuleMaterialDao = async (materialId: string): Promise<IModuleMaterial> => {
    try {
      const id = new Types.ObjectId(materialId);
      const deletedMaterial = await ModuleMaterial.findByIdAndDelete(id);
  
      if (!deletedMaterial) {
        throw new Error("Module Material not found");
      }
    
      return deletedMaterial;
    } catch (error) {
      console.error("Error deleting Module Material:", error);
      throw error;
    }
};

export const getSubmissionByIdDao = async (submissionId: string): Promise<IAssignmentSubmission> => {
  try {
    const id = new Types.ObjectId(submissionId);
    const submission = await AssignmentSubmission.findById(id);

    if (!submission) {
      throw new Error("Submission not found");
    }
  
    return submission;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
};
export const createSubmissionDao = async (
  userId: Types.ObjectId,
  assignmentId: string,
  fileUrl: string,
  status: SubmissionStatus = SubmissionStatus.SUBMITTED
): Promise<IAssignmentSubmission> => {
  try {
      const id = new Types.ObjectId(assignmentId);
      if (await validateSubmission(id)) {
          const newSubmission = new AssignmentSubmission({
              assignmentId: id,
              studentId: userId,
              fileUrl,
              status,
          });

          await newSubmission.save();

          // Fetch user details (assuming you have a function to get user by ID)
          const user = await User.findById(userId) // Implement this function
          if (!user) {
              throw new Error("User not found.");
          }

          // Fetch assignment details (assuming you have a function to get assignment by ID)
          const assignment = await ModuleMaterial.findById(assignmentId); // Implement this function
          if (!assignment) {
              throw new Error("Assignment not found.");
          }

          // Send email to the student
          await sendSubmissionReceivedEmail(user.email, newSubmission, user, assignment.title);

          return newSubmission;
      } else {
          throw new Error("Submission validation failed.");
      }
  } catch (error) {
      console.error("Error creating Submission:", error);
      throw error;
  }
};

export const updateSubmissionDao = async (submissionId: string, updates: Partial<IAssignmentSubmission>): Promise<IAssignmentSubmission> => {
    try {
        const id = new Types.ObjectId(submissionId);
        const existingSubmission = await AssignmentSubmission.findById(id);
        if (!existingSubmission) {
            throw new Error("Submission not found.");
        }
        const updatedSubmission = await AssignmentSubmission.findByIdAndUpdate(
            id,
            updates,
            { new: true }
          );
      
          if (!updatedSubmission) {
            throw new Error("Submission not found");
          }
        notifyStudent(id)
        return updatedSubmission;
    } catch (error) {
        console.error("Error updating Submission status:", error);
        throw error;
    }
};
const notifyStudent = async (submissionId: Types.ObjectId) => {
  try {
    const submission = await AssignmentSubmission.findById(submissionId).populate(
      "studentId",
      "email"
    );

    if (!submission) {
      throw new Error("Submission not found");
    }
 //have to implement
    const studentEmail = submission.studentId;
    const message = `Your assignment has been graded. Grade: ${submission.grade}, Feedback: ${submission.feedback}`;

    // Send notification (e.g., via email or push notification)
    console.log(`Notification sent to ${studentEmail}: ${message}`);
  } catch (error) {
    console.error("Error notifying Student:", error);
    throw error;
  }
};

const validateSubmission = async (assignmentId: Types.ObjectId): Promise<boolean> => {
    try {
      const assignment = await ModuleMaterial.findById(assignmentId);
  
      if (!assignment) {
        throw new Error("Assignment not found");
      }
  
      // Check if the due date has passed
      if (assignment.dueDate && assignment.dueDate < new Date()) {
        throw new Error("Submission deadline has passed.");
      }
  
      console.log("Submission is valid.");
      return true;
    } catch (error) {
      console.error("Error validating Submission:", error);
      throw error;
    }
};

export const isLecturerAssignedToModule = async (lecturerId: Types.ObjectId,moduleId: Types.ObjectId): Promise<boolean> => {
    try {
      const lecturer = await User.findOne({_id: lecturerId,role: Role.LECTURER});
      if (!lecturer) {
        throw new Error("Lecturer not found.");
      }
      let isAssigned = false;
      if(lecturer.teachingModules && lecturer.teachingModules.length > 0) {
         isAssigned = lecturer.teachingModules.some((teachingModule) => teachingModule.equals(moduleId)); 
      }  
      return isAssigned;
    } catch (error) {
      throw error;
    }
};
export const deleteSubmissionDao = async (submissionId: string): Promise<IAssignmentSubmission> => {
    try {
      const id = new Types.ObjectId(submissionId);
      const existingSubmission = await AssignmentSubmission.findById(id);
      if (existingSubmission?.status === SubmissionStatus.GRADED) {
        throw new Error("Submission Cannot delete.");
      }
      const deletedSubmission = await AssignmentSubmission.findByIdAndDelete(id);
      if (!deletedSubmission) {
        throw new Error("Submission not found");
      }
    
      return deletedSubmission;
    } catch (error) {
      console.error("Error deleting Module Material:", error);
      throw error;
    }
};
export const getSubmissionByAssignmentIdDao = async (assignmentId: string): Promise<IAssignmentSubmission[]> => {
    try {
      const id = new Types.ObjectId(assignmentId);
      const submissions = await AssignmentSubmission.find({ assignmentId:id }).populate(
        "studentId",
        "name email"
      );
      return submissions;
    } catch (error) {
      console.error("Error deleting Module Material:", error);
      throw error;
    }
};
export const getMaterialDao = async (moduleId: string): Promise<IModuleMaterial[]> => {
    try {
      const id = new Types.ObjectId(moduleId);
      const materials = await ModuleMaterial.find({ moduleId:id })
      return materials;
    } catch (error) {
      console.error("Error deleting Module Material:", error);
      throw error;
    }
};
export const hasSubmittedDao = async (materialId: string, studentId:Types.ObjectId): Promise<Boolean> => {
    try {
      const id = new Types.ObjectId(materialId);
      const submission = await AssignmentSubmission.findOne({
        assignmentId: id,
        studentId: studentId,
      });
      return !!submission;
    } catch (error) {
      console.error("Error deleting Module Material:", error);
      throw error;
    }
};

export const getLatestAssignmentsForUser = async (studentId: Types.ObjectId) => {
  try {
    const user = await User.findById(studentId).select("enrolledModules");
    if (!user) {
      throw new Error("User not found.");
    }

    // Extract module IDs from the user's enrolledModules array
    const moduleIds = user.enrolledModules ? user.enrolledModules.map((module) => module.moduleId) : [];

    // Fetch the latest assignments for the user's enrolled modules
    const latestAssignments = await ModuleMaterial.aggregate([
      {
        $match: {
          moduleId: { $in: moduleIds }, // Filter by the user's enrolled modules
          type: "ASSIGNMENT", // Filter by assignment type
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by createdAt in descending order (latest first)
      },
      {
        $group: {
          _id: "$moduleId", // Group by moduleId
          latestAssignment: { $first: "$$ROOT" }, // Get the first document (latest assignment) in each group
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          title: "$latestAssignment.title", // Include the title
          dueDate: "$latestAssignment.dueDate", // Include the due date
        },
      },
      {
        $limit: 2, // Limit the results to the two most recent assignments
      },
    ]);

    return latestAssignments;
  } catch (error) {
    console.error("Error in getLatestAssignmentsForUser:", error);
    throw error;
  }
};