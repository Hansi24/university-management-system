// src/types/express.d.ts
import { Types } from 'mongoose';


declare global {
  namespace Express {
    interface Request {
      user: { userId: Types.ObjectId;
        userRole: string /* Add other properties if necessary */
        userType: string };
    }
  }
}
