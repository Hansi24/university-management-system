import { ROLE_TYPES, USER_TYPES } from './../enums/roleEnums';
import axios from "axios";
import { AppResponse } from "../models/Response";
import { Util } from "../utils/util";
import Semester from '../components/pages/common/Semester';



export class AuthService {
    public static async Register(data: any): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl("register");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async Login(data: any): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl("login");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async getUsersByUserRole(): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl(`${ROLE_TYPES.LECTURER}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getUserDetails(): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl('user-details');
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getUsersByBatchAndCourse(batch:string, course:string): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl(`user/${batch}/${course}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getAllUsers(): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl('all-users');
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async upgradeSemester(userId:string, semester:number): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl(`upgrade-semester/${userId}`);
        return await axios.put<Partial<any>, AppResponse<any>>(url, {semester});
    }
    public static async getStudentDetails(userId:string): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl(`student-details/${userId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }

    public static async getUsers(url: string): Promise<AppResponse<any>> {
        const fullUrl = Util.apiAuthUrl(url);
        return await axios.get<Partial<any>, AppResponse<any>>(fullUrl);
    }
    public static async updateUserType(userId:string): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl(`make-rep`);
        return await axios.put<Partial<any>, AppResponse<any>>(url, {userId});
    }
}  