import mongoose, { Schema } from "mongoose";
import { IUser } from "../modal/IUser";
import { AdminType, Gender, LecturerType, Role, StudentType } from "../enums/UserEnums";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(Role) },
  type: { type: String, required: true },
  batch: { 
    type: Number, 
    required: function (this: IUser) { return this.role === Role.STUDENT; } 
  },
  courseId: { 
    type: Schema.Types.ObjectId, 
    ref: "Course", 
    required: function (this: IUser) { return this.role === Role.STUDENT; }
  },
  semester: { 
    type: Number, 
    required: function (this: IUser) { return this.role === Role.STUDENT; }, 
    default: function (this: IUser) { return this.role === Role.STUDENT ? 1 : undefined; } 
  },
  enrolledModules: [{
    moduleId: { type: Schema.Types.ObjectId, ref: "Module" },  
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" }  
  }],
  teachingModules: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Module", 
    required: function (this: IUser) { return this.role === Role.LECTURER; } 
  }],
  regId: { type: String, required: true, unique: true },
  gender: { type: String, required: true, enum: Object.values(Gender) },
  address: { 
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String },
});


// Restrict `type` based on `role`
userSchema.pre("validate", function (next) {
  console.log("this:", this);  // Add this line to log the full document
  const roleTypeMap: Record<Role, string[]> = {
    [Role.STUDENT]: Object.values(StudentType),
    [Role.LECTURER]: Object.values(LecturerType),
    [Role.ADMIN]: Object.values(AdminType)
  };

  const userRole = this.role as Role; // Explicit type assertion
  const userType = this.type as string; // Explicit type assertion

  if (!userRole || !userType) {
    return next(new Error("Role and type must be provided"));
  }

  if (!roleTypeMap[userRole]?.includes(userType)) {
    return next(new Error(`Invalid type '${userType}' for role '${userRole}'`));
  }
  
  next();
});



export const User = mongoose.model<IUser>("User", userSchema);
