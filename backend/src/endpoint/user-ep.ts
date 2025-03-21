import { NextFunction, Request, Response } from 'express';
import { changePasswordDao, createUser, deleteUserDao, getAllUsersDao, getUserByIdDao, getUsersByUserRoleDao, getUsersDao, login, makeRepDao, resetPasswordDao, updateUserProfile, upgradeSemesterDao, userDetails } from '../dao/user-dao';
import { Util } from '../utils/util';
import { AdminType, LecturerType, Role, StudentType } from '../enums/UserEnums';
import { User } from '../schema/User';
import { IUser } from '../modal/IUser';
import mongoose, { Types } from 'mongoose';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { 
        name, email, phone, role, type, batch, courseId, teachingModules, gender, address 
    } = req.body;
    try {
        let profilePic = "";
        let regId = "";
        const userType = type || (role === Role.STUDENT ? StudentType.STUDENT : LecturerType.LECTURER);
        const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
        let teachingModuleIds:mongoose.Types.ObjectId[] = [];
        if (typeof teachingModules === 'string') {
            try {
              const parsedTeachingModules = JSON.parse(teachingModules);
              if (Array.isArray(parsedTeachingModules)) {
                teachingModuleIds = parsedTeachingModules.map((moduleId) => new mongoose.Types.ObjectId(moduleId as string));
              }
            } catch (error) {
              console.error("Error parsing teachingModules:", error);
            }
          }
        if (req.file) {
            profilePic = (req.file as any).path;
        }
        if (!Object.values(Role).includes(role)) {
            return Util.sendError(res, "Invalid role", 400);
        }
        if (role === Role.STUDENT) {
            if (!batch || !courseId) {
                return Util.sendError(res, "Batch, Course ID are required for students", 400);
            }
            const studentCount = await User.countDocuments();
            regId = `NHDN${studentCount + 100}`;
        }

        if (role === Role.LECTURER) {
            if (!teachingModules || !courseId) {
                return Util.sendError(res, "Teaching Modules and Course ID are required for lecturers", 400);
            }
            const lecturerCount = await User.countDocuments();
            regId = `NHDN${lecturerCount + 100}`;
        }

        if (role === Role.ADMIN) {
            if (!Object.values(AdminType).includes(userType)) {
                return Util.sendError(res, "Invalid admin type", 400);
            }

            const adminPrefix = userType === AdminType.ACADEMIC ? "A" : userType === AdminType.RESOURCE ? "R" : "E";
            const adminCount = await User.countDocuments({ role: Role.ADMIN, type: userType });
            regId = `${adminPrefix}${String(adminCount + 1).padStart(4, "0")}`;
        }
        const password = regId;
        const newUser:IUser = {
            name,
            email,
            password,
            phone,
            role,
            type:userType,
            batch: role === Role.STUDENT ? batch : undefined,
            courseId: role !== Role.ADMIN ? courseId : undefined,
            teachingModules: role === Role.LECTURER ? teachingModuleIds : undefined,
            regId,
            gender,
            address: parsedAddress,
            profilePic
        };
        const result = await createUser(newUser);
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
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.userId;
    try {
        const credentialDetails = await getUserByIdDao(userId);
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
            updates.profilePic = (req.file as any).path;
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
        const users = await getAllUsersDao();
        return Util.sendSuccess(res, users , "users retrieved successfully");
    } catch (error) {
        next(error);
    }
}
export const getUsersByUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const role = req.params.userRole as Role;
    console.log(role)
    try {
        const users = await getUsersByUserRoleDao(role);
        return Util.sendSuccess(res, users , "users retrieved successfully");
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;
    try {
        const credentialDetails = await changePasswordDao(userId, oldPassword, newPassword);
        return Util.sendSuccess(res, credentialDetails, "Password updated successfully");
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, newPassword } = req.body;
    try {
        const credentialDetails = await resetPasswordDao(email, newPassword);
        return Util.sendSuccess(res, credentialDetails, "Password updated successfully");
    } catch (error) {
        next(error);
    }
}
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { batch, courseId } = req.params;
    const userRole = req.user.userRole;
  try {
    if(userRole !== Role.ADMIN) {
        return Util.sendError(res, "You are not authorized to view users", 401);
    }
    let query: any = { courseId };

    if (batch) {
      query.batch = batch;
      query.role = Role.STUDENT;
    } else {
      query.role = Role.LECTURER;
    }
    const users = await getUsersDao(query);
    return Util.sendSuccess(res, users, "Password updated successfully");
    } catch (error) {
        next(error);
    }
}

export const makeRep = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    const userId = req.body.userId;
    try {
        if(req.user.userRole!== Role.ADMIN){
            return Util.sendError(res, "You are not authorized to make a representative", 401);
        }
        const user = await makeRepDao(userId);
        return Util.sendSuccess(res, user , "Representative updated successfully");
    } catch (error) {
        next(error);
    }
}
export const upgradeSemester = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    const userId = req.params.userId;
    const semester = req.body.semester;
    try {
        if(req.user.userRole!== Role.ADMIN){
            return Util.sendError(res, "You are not authorized to make a representative", 401);
        }
        if (semester >= 5) {
            return Util.sendError(res, "Maximum semester limit reached (4)", 401);
        }
        const user = await upgradeSemesterDao(userId, semester);
        return Util.sendSuccess(res, user , "Representative updated successfully");
    } catch (error) {
        next(error);
    }
}
