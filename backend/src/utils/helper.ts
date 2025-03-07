import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';  // assuming your JWT_SECRET is stored here
import crypto from 'crypto';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Helper Interface for JWT Payload
interface JwtPayload {
    userId: Types.ObjectId;
    userRole: string;
    type?: string;
}
declare global {
    namespace Express {
        interface Request {
            user: {
                userId: Types.ObjectId;
                userRole: string;
            };
        }
    }
}
export namespace Helper{
    export const generateToken = (userId: Types.ObjectId, userRole:string, type:string): string => {
        const payload: JwtPayload = { userId, userRole, type };
        const secretKey = config.JWT_SECRET;
        return jwt.sign(payload, secretKey, { expiresIn: config.JWT_EXPIRES_IN });
    };
    
    // 2. Verify JWT Token
    export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
        const token = req.header('Authorization'); // Get token from the Authorization header

        if (!token) { 
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }

        try {
            const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
            const decoded = jwt.verify(tokenWithoutBearer, config.JWT_SECRET) as { userId: Types.ObjectId, userRole: string };
            req.user = { userId: decoded.userId , userRole: decoded.userRole};
            next();
        } catch (error) {
            res.status(400).json({ error: 'Invalid or expired token' });
            return 
        }
    }
    
    // 3. Hash Password
    export const hashPassword = async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
        return hashedPassword;
    };
    
    // 4. Compare Password
    export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
        console.log(password, hashedPassword);
        const isMatch = await bcrypt.compare(password, hashedPassword); // Compare password with hash
        return isMatch;
    };
    
    // 5. Generate Random String (e.g., for generating random tokens, etc.)
    export const generateRandomString = (length: number): string => {
        return crypto.randomBytes(length).toString('hex'); // Generates a random string of the specified length
    };
    
    // 6. Generate Password Reset Token (with expiry)
    export const generatePasswordResetToken = () => {
        const token = generateRandomString(32); // Generate a random reset token
        const expirationDate = Date.now() + 3600000; // Set expiration time (1 hour)
        return { token, expirationDate };
    };
    
    // 7. Validate Email Format
    export const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email); // Check if email matches regex
    };
    
    // 8. Handle Error (Custom Error Response Format)
    export const handleError = (message: string, statusCode: number) => {
        return { error: message, statusCode }; // Return error message and status code
    };
    
    
}
// 1. Generate JWT Token
