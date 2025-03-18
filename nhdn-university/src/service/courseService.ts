import axios from "axios";
import { AppResponse } from "../models/Response";
import { Util } from "../utils/util";
import Semester from '../components/pages/common/Semester';



export class CourseService {
    public static async createCourse(data: any): Promise<AppResponse<any>> {
        const url = Util.apiUrl("course");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async getAllCourse(): Promise<AppResponse<any>> {
        const url = Util.apiUrl("course");
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getTimetable(courseId:string, semester:number): Promise<AppResponse<any>> {
        const url = Util.apiUrl(`course/get-timetable/${courseId}/${semester}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async updateTimetable(courseId:string, semester:number, data: any): Promise<AppResponse<any>> {
        const url = Util.apiUrl(`course/update-timetable/${courseId}/${semester}`);
        return await axios.patch<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async createTimetable(data: any): Promise<AppResponse<any>> {
        const url = Util.apiUrl("course/create-timetable");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async getSemesterModules(courseId:string, semester:number): Promise<AppResponse<any>> {
        const url = Util.apiUrl(`course/get-modules/${courseId}/${semester}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getSemestersAndModules(courseId:string, studentId:string): Promise<AppResponse<any>> {
        const url = Util.apiUrl(`course/${courseId}/semesters?studentId=${studentId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    
    public static async enrollModule(courseId:string, moduleId:string): Promise<AppResponse<any>> {
        const url = Util.apiUrl(`course/${courseId}/enroll`);
        return await axios.post<Partial<any>, AppResponse<any>>(url, {moduleId});
    }
}  