import { IResourceBooking } from "../modal/IResourceBooking";
import { IUser } from "../modal/IUser";
import { sendEmail } from "./email-config";

export const sendResourceBookingRequestEmail = async (adminEmail: string, resourceName:string, booking: IResourceBooking, user: IUser) => {
    const emailSubject = "New Resource Booking Request";

    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">New Resource Booking Request</h2>
          <p>A new resource booking request has been submitted. Here are the details:</p>
          <ul>
            <li><strong>Subject:</strong> ${booking.subject}</li>
            <li><strong>Description:</strong> ${booking.description}</li>
            <li><strong>Requested by:</strong> ${user.regId} ${user.name}</li>
            <li><strong>Resource ID:</strong> ${resourceName}</li>
            <li><strong>Start Time:</strong> ${new Date(booking.startTime).toLocaleString()}</li>
            <li><strong>End Time:</strong> ${new Date(booking.endTime).toLocaleString()}</li>
          </ul>
          <p>Please review and approve/reject the booking.</p>
          <br>
          <a href="http://localhost:5173/requestedResource" style="color: #4CAF50;">View Booking Requests</a>
          <br><br>
          <img src="https://res.cloudinary.com/dzk6bdune/image/upload/v1740579709/360_F_491766294_h4j7LbW2YgfbNHhq7F8GboIc1XyBSEY5_ashwvo.jpg" alt="University Logo" style="width: 150px; height: auto;" />
          <p>Thank you!</p>
        </body>
      </html>
    `;

    // Send the email
    await sendEmail(adminEmail, emailSubject, emailBody);
};
