import { NextFunction, Request, Response } from 'express';
import { createUser, deleteUserDao, getAllUsersDao, login, updateUserProfile, userDetails } from '../dao/user-dao';
import { Util } from '../utils/util';
import { AdminType, LecturerType, Role, StudentType } from '../enums/UserEnums';
import { User } from '../schema/User';
import { IUser } from '../modal/IUser';

// Create new user
// export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const { name, email, password, phone, role, batch, courseId, teachingModules } = req.body;
//     try {
//         let profilePic = "";
//         let registrationNumber = "";
//         // If user uploaded an image, store it in Cloudinary
//         if (req.file) {
//             profilePic = (req.file as any).path; // Cloudinary stores the URL in `req.file.path`
//         }
//         if (role === Role.STUDENT){
//             if (!batch || !courseId) {
//                 return Util.sendError(res, "Batch number is required for student", 400);
//             }
//             registrationNumber = `EL${Math.floor(1000 + Math.random() * 9000)}`;
//         }
//         if (role === Role.LECTURER) {
//             if (!moduleId){
//                 return Util.sendError(res, "Module ID is required for lecturer", 400);
//             }
//             registrationNumber = `ET${Math.floor(1000 + Math.random() * 9000)}`;
//         }
//         const credentialDetails = await createUser({ name, email, password, phone, profilePic, role, batch , courseId, teachingModules });
//         return Util.sendSuccess(res, credentialDetails, "user registered successfully");
//     } catch (error) {
//         next(error);
//     }
// };
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(req.body);
    const { 
        name, email, phone, role, type, batch, courseId, teachingModules, gender, address 
    } = req.body;
    console.log(role);
    try {
        let profilePic = "";
        let regId = "";
        const userType = type || (role === Role.STUDENT ? StudentType.STUDENT : LecturerType.LECTURER);

        // Handle profile picture upload (assuming Cloudinary)
        if (req.file) {
            profilePic = (req.file as any).path;
        }

        // Validate role and type
        if (!Object.values(Role).includes(role)) {
            return Util.sendError(res, "Invalid role", 400);
        }

        // Role-based processing for Student
        if (role === Role.STUDENT) {
            if (!batch || !courseId) {
                return Util.sendError(res, "Batch, Course ID are required for students", 400);
            }
            // if (!Object.values(StudentType).includes(type)) {
            //     return Util.sendError(res, "Invalid student type", 400);
            // }

            // Reg ID format: course 1st letter + batch last 2 digits + length of students + 1
            const studentCount = await User.countDocuments({ role: Role.STUDENT });
            regId = `${courseId.charAt(0)}${batch.toString().slice(-2)}${studentCount + 1}`;
        }

        // Role-based processing for Lecturer
        if (role === Role.LECTURER) {
            if (!teachingModules || !courseId) {
                return Util.sendError(res, "Teaching Modules and Course ID are required for lecturers", 400);
            }
            // if (!Object.values(LecturerType).includes(type)) {
            //     return Util.sendError(res, "Invalid lecturer type", 400);
            // }

            // Reg ID format: course 1st letter + module 1st letter + length of lecturers + 1
            const lecturerCount = await User.countDocuments({ role: Role.LECTURER });
            regId = `${courseId.charAt(0)}${teachingModules[0].charAt(0)}${lecturerCount + 1}`;
        }

        // Role-based processing for Admin
        if (role === Role.ADMIN) {
            if (!Object.values(AdminType).includes(userType)) {
                return Util.sendError(res, "Invalid admin type", 400);
            }

            // Reg ID format: A0001, R0001, E0001
            const adminPrefix = type === AdminType.ACADEMIC ? "A" : type === AdminType.RESOURCE ? "R" : "E";
            const adminCount = await User.countDocuments({ role: Role.ADMIN });
            regId = `${adminPrefix}${String(adminCount + 1).padStart(4, "0")}`;
        }
        const password = regId;
        // Create a Mongoose document using the User model
        const newUser:IUser = {
            name,
            email,
            password,
            phone,
            role,
            type:userType,
            batch: role === Role.STUDENT ? batch : undefined,
            courseId: role !== Role.ADMIN ? courseId : undefined,
            teachingModules: role === Role.LECTURER ? teachingModules : undefined,
            regId,
            gender,
            address,
            profilePic
        };

        // Use createUser to save the user and return the token
        const result = await createUser(newUser);

        // Return the successful response with the token
        return Util.sendSuccess(res, result, "User registered successfully");

    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { regId, password } = req.body;
    try {
        const credentialDetails = await login({  regId, password });
        return Util.sendSuccess(res, credentialDetails, "user login successfully");
    } catch (error) {
        next(error);
    }
};
export const userDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.userId;
    try {
        const credentialDetails = await userDetails(userId);
        return Util.sendSuccess(res, credentialDetails, "user login successfully");
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.userId;
    const updates = req.body;
    try {
        if (req.file) {
            updates.profilePic = (req.file as any).path; // Cloudinary stores the URL in `req.file.path`
        }
        const credentialDetails = await updateUserProfile(userId, updates);
        return Util.sendSuccess(res, credentialDetails, "user profile updated successfully");
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id;
    if( req.user.userRole !== Role.ADMIN){
        return Util.sendError(res, "You are not authorized to delete user", 401);
    }
    try {
        // Delete user
        const userDelete = await deleteUserDao(userId);
        return Util.sendSuccess(res, userDelete , "user deleted successfully");
    } catch (error) {
        next(error);
    }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if(req.user.userRole!== Role.ADMIN){
        return Util.sendError(res, "You are not authorized to view all users", 401);
    }
    try {
        // Get all users
        const users = await getAllUsersDao();
        return Util.sendSuccess(res, users , "users retrieved successfully");
    } catch (error) {
        next(error);
    }
}

