import axios from "axios";
import { AppResponse } from "../models/Response";
import { Util } from "../utils/util";
import { IResourceBooking } from "../models/ResourceBooking";
import { ResourceType } from "../models/Resource";
import { IModuleMaterial } from "../models/Material";
import { IAssignmentSubmission } from "../models/Assignment";



export class ModuleService {
    public static async createMaterial(data: any): Promise<AppResponse<any>> {
        const url = Util.apiUrl("module/create-material");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async getModuleDetails(moduleId:string): Promise<AppResponse<IModuleMaterial[]>> {
        const url = Util.apiUrl(`module/get-materials/${moduleId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getMaterialDetails(materialId:string): Promise<AppResponse<IModuleMaterial>> {
        const url = Util.apiUrl(`module/material/${materialId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getSubmissions(assignmentId:string): Promise<AppResponse<IAssignmentSubmission[]>> {
        const url = Util.apiUrl(`module/get-submission-by-assignmentId/${assignmentId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async updateMaterial(materialId:string, updatedMaterial:Partial<IModuleMaterial>): Promise<AppResponse<IModuleMaterial>> {
        const url = Util.apiUrl(`module/update-materials/${materialId}`);
        return await axios.patch<Partial<any>, AppResponse<any>>(url, updatedMaterial);
    }
    public static async submitAssignment(submissionData:{assignmentId:string, fileUrl:string}): Promise<AppResponse<IAssignmentSubmission>> {
        const url = Util.apiUrl(`module/submission`);
        return await axios.post<Partial<any>, AppResponse<any>>(url, submissionData);
    }
    public static async getSubmissionDetails(submissionId:string): Promise<AppResponse<IAssignmentSubmission>> {
        const url = Util.apiUrl(`module/submission/${submissionId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async hasStudentSubmitted(materialId:string): Promise<AppResponse<boolean>> {
        const url = Util.apiUrl(`module/materials/${materialId}/has-submitted`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getLatestAssignmentsForUser(): Promise<AppResponse<{ title: string; dueDate: string }[]>> {
        const url = Util.apiUrl(`module/latest-assignments/by-user`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
}  