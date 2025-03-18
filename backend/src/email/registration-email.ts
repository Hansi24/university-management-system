import { IUser } from "../modal/IUser";
import { sendEmail } from "./email-config";

export const sendRegistrationEmail = async (user: IUser, tempPassword: string, regId: string) => {
    // HTML Email Content with logo and user details
    const emailSubject = 'Your Registration Information at SUMS UNIVERSITY';
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to SUMS UNIVERSITY, ${user.name}!</h2>
          <p>Your registration is complete. Here are your details:</p>
          <ul>
            <li><strong>Registration ID:</strong> ${regId}</li>
            <li><strong>Temporary Password:</strong> ${tempPassword}</li>
          </ul>
          <p>Click the link below to log in and change your password:</p>
          <a href="http://your-login-url.com" style="color: #4CAF50;">Log in here</a>
          <br><br>
          <img src="https://res.cloudinary.com/dzk6bdune/image/upload/v1740579709/360_F_491766294_h4j7LbW2YgfbNHhq7F8GboIc1XyBSEY5_ashwvo.jpg" alt="University Logo" style="width: 150px; height: auto;" />
          <p>Thank you for joining us!</p>
        </body>
      </html>
    `;
  
    // Send the email
    await sendEmail(user.email, emailSubject, emailBody);
  };