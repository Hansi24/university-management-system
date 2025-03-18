import e from 'express';
import { Helper } from '../utils/helper';
import { ObjectId, Types } from 'mongoose';
import { ILoginUser, IUser } from '../modal/IUser';
import { User } from '../schema/User';
import { sendRegistrationEmail } from '../email/registration-email';
import { Role, StudentType } from '../enums/UserEnums';
import Course from '../schema/Course';

export const createUser = async (userData: IUser) => {
  try {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
          throw new Error('User with this email already exists');
      }
      const hashedPassword = await Helper.hashPassword(userData.password);
      const newUser = new User({
        ...userData,
        password: hashedPassword,
      });
      await newUser.save();
      // const token = Helper.generateToken(new Types.ObjectId(newUser._id), newUser.role, newUser.type)
      await sendRegistrationEmail(newUser, userData.password, userData.regId);
      return {user: newUser};
  } catch (error) {
      throw error;
  }
};

export const login = async (userData: ILoginUser) => {
  try {
    let existingUser;
    // Check if email is provided and search by email
    if (userData.regId) {
        existingUser = await User.findOne({ regId: userData.regId });
    }
    // If user is not found, throw an error
    if (!existingUser) {
        throw new Error('User not found');
    }
      const isPasswordValid = await Helper.comparePassword(userData.password, existingUser.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const token = Helper.generateToken(new Types.ObjectId(existingUser._id), existingUser.role, existingUser.type);
      return {token: token };
  } catch (error) {
      throw error;
  }
};
export const userDetails = async (userId: Types.ObjectId) => {
  try {
      const existingUser = await User.findById(userId).select('-password');
      if (!existingUser) {
        throw new Error('User not found');
      }
      return existingUser;
  } catch (error) {
      throw error;
  }
};
export const getUserByIdDao = async (userId: string) => {
  try {
      const user = new Types.ObjectId(userId);
      const existingUser = await User.findById(user).select('-password').populate("courseId");
      if (!existingUser) {
        throw new Error('User not found');
      }
      return existingUser;
  } catch (error) {
      throw error;
  }
};

export const updateUserProfile = async (userId: Types.ObjectId, updates:any) => {
  try {
      //Update user profile (only the provided fields)
      const updatedUser = await User.findByIdAndUpdate(userId, updates, { 
          new: true, 
          runValidators: true 
      }).select("-password"); // Exclude password from response
      if (!updatedUser) {
          throw new Error("User not found");
      }

      return { user: updatedUser };
  } catch (error) {
      throw error;
  }
};

export const deleteUserDao = async (userId: string) => {
  try {
      const user = new Types.ObjectId(userId);
      const deletedUser = await User.findByIdAndDelete(user);
      if (!deletedUser) {
          throw new Error("User not found");
      }
      return deletedUser;
  } catch (error) {
      throw error;
  }
};
export const getAllUsersDao = async () => {
    try {
      const users = await User.find()
        .select("-password") // Exclude the password field
        .populate({
          path: "courseId", // Field to populate
          select: "name code", // Specify the fields you want to populate
        });
      return users;
    } catch (error) {
      throw error;
    }
};
export const getUsersByUserRoleDao = async (role:Role) => {
  try {
      const users = await User.find({role:role}).select("-password");
      return users;
  } catch (error) {
      throw error;
  }
};

export const changePasswordDao = async (userId: Types.ObjectId, oldPassword: string, newPassword: string) => {
  try {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
          throw new Error("User not found");
      }
      const isPasswordValid = await Helper.comparePassword(oldPassword, existingUser.password);
      if (!isPasswordValid) {
          throw new Error("Invalid password");
      }
      const hashedPassword = await Helper.hashPassword(newPassword);
      const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
      return { user: updatedUser };
  } catch (error) {
      throw error;
  }
};
export const resetPasswordDao = async (email:string, newPassword: string) => {
  try {
      const existingUser = await User.findOne({email: email});
      if (!existingUser) {
          throw new Error("User not found");
      }
      const hashedPassword = await Helper.hashPassword(newPassword);
      const updatedUser = await User.findByIdAndUpdate(existingUser._id, { password: hashedPassword }, { new: true });
      return { user: updatedUser };
  } catch (error) {
      throw error;
  }
};
export const getUsersDao = async (query:any) => {
  try {
      const existingCourse = await Course.findById({_id: query.courseId});
      if (!existingCourse) {
          throw new Error("Course not found");
      }
      const users = await User.find(query).select("-password").populate({
        path: "courseId", // Field to populate
        select: "name code", // Specify the fields you want to populate
      });;
      return users;
  } catch (error) {
      throw error;
  }
};

export const makeRepDao = async (userId: string) =>{
    try {
        const user = new Types.ObjectId(userId);
        const student = await User.findById(user);
        if (!student) {
            throw new Error("user not found");
        }
        if (student.type === StudentType.REP) {
            throw new Error("User is already a rep");
        }  
        const existingRep = await User.findOne({
            batch: student.batch,
            courseId: student.courseId,
            type: StudentType.REP,
        });
      
        if (existingRep) {
            // Demote the existing rep to a student
            await User.findByIdAndUpdate(
              existingRep._id,
              { type: StudentType.STUDENT },
              { new: true }
            );
        }
      
          // Mark the new student as rep
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { type: StudentType.REP },
            { new: true } // Return the updated document
        );    
        return { user: updatedUser };
    } catch (error) {
        throw error;
    }
}
export const upgradeSemesterDao = async (userId: string, semester:number) =>{
    try {
        const user = new Types.ObjectId(userId);
        const student = await User.findById(user);
        if (!student) {
            throw new Error("user not found");
        }
        if (!(student.type === StudentType.REP || student.type === StudentType.STUDENT)) {
            throw new Error("Only students can upgrade their semester");
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { semester: semester },
            { new: true } // Return the updated document
          );
        return { user: updatedUser };
    } catch (error) {
        throw error;
    }
}
