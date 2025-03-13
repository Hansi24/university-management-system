import axios from "axios";
import { AppResponse } from "../models/Response";
import { Util } from "../utils/util";



export class CourseService {
    public static async createCourse(data: any): Promise<AppResponse<any>> {
        const url = Util.apiUrl("course");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async getAllCourse(): Promise<AppResponse<any>> {
        const url = Util.apiUrl("course");
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
}  