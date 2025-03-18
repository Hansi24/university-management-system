import axios from "axios";
import { AppResponse } from "../models/Response";
import { Util } from "../utils/util";
import { IResourceBooking } from "../models/ResourceBooking";
import { ResourceType } from "../models/Resource";



export class ResourceService {
    public static async createResource(data: any): Promise<AppResponse<any>> {
        const url = Util.apiUrl("resource");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async resourceRequest(data: IResourceBooking): Promise<AppResponse<IResourceBooking>> {
        const url = Util.apiUrl("resource/resource-booking");
        return await axios.post<Partial<any>, AppResponse<IResourceBooking>>(url, data);
    }
    public static async getAllResource(): Promise<AppResponse<any>> {
        const url = Util.apiUrl("resource");
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getAllClassroomResource(): Promise<AppResponse<any>> {
        const url = Util.apiUrl(`resource/type/${ResourceType.CLASSROOM}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getAvailableResources(startTime:string, endTime:string): Promise<AppResponse<any>> {
        const url = Util.apiUrl("resource/available");
        return await axios.post<Partial<any>, AppResponse<any>>(url, {startTime, endTime});
    }
    public static async getBookedResource(): Promise<AppResponse<IResourceBooking[]>> {
        const userId = localStorage.getItem("userId");
        const url = Util.apiUrl(`resource/get-booked-resource/${userId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
}  