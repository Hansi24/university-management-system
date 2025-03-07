import e from 'express';
import { Helper } from '../utils/helper';
import { ObjectId, Types } from 'mongoose';
import { ILoginUser, IUser } from '../modal/IUser';
import { User } from '../schema/User';
import { sendRegistrationEmail } from '../email/registraion-email';

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
      const users = await User.find().select("-password");
      return users;
  } catch (error) {
      throw error;
  }
};