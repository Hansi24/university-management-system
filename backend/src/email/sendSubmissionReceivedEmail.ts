import { IAssignmentSubmission } from "../modal/IAssignmentSubmission";
import { IUser } from "../modal/IUser";
import { sendEmail } from "./email-config";

export const sendSubmissionReceivedEmail = async (studentEmail: string, submission: IAssignmentSubmission, user: IUser, assignmentName: string) => {
    const emailSubject = "Your Submission Has Been Received";

    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Submission Received</h2>
          <p>Dear ${user.name},</p>
          <p>Your submission for the assignment <strong>${assignmentName}</strong> has been successfully received. Here are the details:</p>
          <ul>
            <li><strong>Assignment Name:</strong> ${assignmentName}</li>
            <li><strong>Submission ID:</strong> ${submission._id}</li>
            <li><strong>Submitted by:</strong> ${user.regId} ${user.name}</li>
            <li><strong>Submission Status:</strong> ${submission.status}</li>
            <li><strong>Submission Time:</strong> ${new Date(submission.createdAt).toLocaleString()}</li>
            <li><strong>File URL:</strong> <a href="${submission.fileUrl}" target="_blank">Download Submission</a></li>
          </ul>
          <p>Thank you for your submission. You will be notified once the assignment is reviewed.</p>
          <br>
          <a href="http://localhost:5173/submissions" style="color: #4CAF50;">View Your Submissions</a>
          <br><br>
          <img src="https://res.cloudinary.com/dzk6bdune/image/upload/v1740579709/360_F_491766294_h4j7LbW2YgfbNHhq7F8GboIc1XyBSEY5_ashwvo.jpg" alt="University Logo" style="width: 150px; height: auto;" />
          <p>Best regards,</p>
          <p>University Team</p>
        </body>
      </html>
    `;

    // Send the email
    await sendEmail(studentEmail, emailSubject, emailBody);
};