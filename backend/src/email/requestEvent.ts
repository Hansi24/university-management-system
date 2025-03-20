import { IUser } from "../modal/IUser";
import { sendEmail } from "./email-config";

export const sendEventRequestEmail = async (
    adminEmail: string,
    eventTitle: string,
    eventDescription: string,
    eventDate: Date,
    eventLocation: string,
    user: IUser
  ) => {
    const emailSubject = "New Event Request";
  
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">New Event Request</h2>
          <p>A new event request has been submitted. Here are the details:</p>
          <ul>
            <li><strong>Event Title:</strong> ${eventTitle}</li>
            <li><strong>Description:</strong> ${eventDescription}</li>
            <li><strong>Requested by:</strong> ${user.regId} ${user.name}</li>
            <li><strong>Event Date:</strong> ${new Date(eventDate).toLocaleString()}</li>
            <li><strong>Location:</strong> ${eventLocation}</li>
          </ul>
          <p>Please review and approve/reject the event.</p>
          <br>
          <a href="http://localhost:5173/eventRequests" style="color: #4CAF50;">View Event Requests</a>
          <br><br>
          <img src="https://res.cloudinary.com/dzk6bdune/image/upload/v1740579709/360_F_491766294_h4j7LbW2YgfbNHhq7F8GboIc1XyBSEY5_ashwvo.jpg" alt="University Logo" style="width: 150px; height: auto;" />
          <p>Thank you!</p>
        </body>
      </html>
    `;
  
    // Send the email
    await sendEmail(adminEmail, emailSubject, emailBody);
  };