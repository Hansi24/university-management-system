import { Types } from "mongoose";
import { IModuleMaterial } from "../modal/IModuleMaterial";
import { User } from "../schema/User";
import { sendEmail } from "./email-config";


export const sendMaterialNotificationEmail = async (material: IModuleMaterial, moduleId: Types.ObjectId) => {
    try {
        // Fetch all users enrolled in the module
        const enrolledUsers = await User.find({ enrolledModules: { $elemMatch: { moduleId: moduleId } } });

        if (enrolledUsers.length === 0) {
            console.log("No users enrolled in this module.");
            return;
        }

        const emailSubject = `New ${material.type} Added: ${material.title}`;

        // Send email to each enrolled user
        for (const user of enrolledUsers) {
            const emailBody = `
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #4CAF50;">New ${material.type} Added</h2>
                        <p>Dear ${user.name},</p>
                        <p>A new ${material.type} has been added to your module. Here are the details:</p>
                        <ul>
                            <li><strong>Title:</strong> ${material.title}</li>
                            <li><strong>Description:</strong> ${material.description}</li>
                            <li><strong>Type:</strong> ${material.type}</li>
                            <li><strong>Posted on:</strong> ${new Date(material.createdAt).toLocaleString()}</li>
                        </ul>
                        <p>Please review the ${material.type} and complete it before the deadline.</p>
                        <br>/module/:id/materials/:materialId
                        <a href="http://localhost:5173/module/${moduleId}/materials/${material._id}" style="color: #4CAF50;">View ${material.type}</a>
                        <br><br>
                        <img src="https://res.cloudinary.com/dzk6bdune/image/upload/v1740579709/360_F_491766294_h4j7LbW2YgfbNHhq7F8GboIc1XyBSEY5_ashwvo.jpg" alt="University Logo" style="width: 150px; height: auto;" />
                        <p>Best regards,</p>
                        <p>University Team</p>
                    </body>
                </html>
            `;

            // Send the email
            await sendEmail(user.email, emailSubject, emailBody);
        }
    } catch (error) {
        console.error("Error sending material notification emails:", error);
        throw error;
    }
};