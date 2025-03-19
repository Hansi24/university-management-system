import axios from "axios";
import { AppResponse } from "../models/Response";
import { Util } from "../utils/util";
import { BookingStatus, IResourceBooking } from "../models/ResourceBooking";
import { IResource, ResourceType } from "../models/Resource";



export class ResourceService {
    public static async createResource(data: any): Promise<AppResponse<any>> {
        const url = Util.apiUrl("resource/create-resource");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async resourceRequest(data: IResourceBooking): Promise<AppResponse<IResourceBooking>> {
        const url = Util.apiUrl("resource/book/resource-booking");
        return await axios.post<Partial<any>, AppResponse<IResourceBooking>>(url, data);
    }
    public static async getAllResource(): Promise<AppResponse<any>> {
        const url = Util.apiUrl("resource/get-all-resource");
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getAllClassroomResource(): Promise<AppResponse<any>> {
        const url = Util.apiUrl(`resource/get-resource-by-type/${ResourceType.CLASSROOM}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getAvailableResources(startTime:string, endTime:string): Promise<AppResponse<any>> {
        const url = Util.apiUrl("resource/get-available-resources");
        return await axios.post<Partial<any>, AppResponse<any>>(url, {startTime, endTime});
    }
    public static async getBookedResource(): Promise<AppResponse<IResourceBooking[]>> {
        const userId = localStorage.getItem("userId");
        const url = Util.apiUrl(`resource/get-booked-resource/${userId}`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async getRequestedResources(): Promise<AppResponse<IResourceBooking[]>> {
        const url = Util.apiUrl(`resource/get-requested-resource`);
        return await axios.get<Partial<any>, AppResponse<any>>(url);
    }
    public static async updateResourceStatus(bookedId:string, bookingStatus:BookingStatus): Promise<AppResponse<IResourceBooking>> {
        const url = Util.apiUrl(`resource/update-requested-resource-status/status/${bookedId}`);
        return await axios.put<Partial<any>, AppResponse<any>>(url, { bookingStatus});
    }
    public static async updateResource(id:string, data:IResource): Promise<AppResponse<IResource>> {
        const url = Util.apiUrl(`resource/update-resource-by-id/${id}`);
        return await axios.patch<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async deleteResource(id:string): Promise<AppResponse<IResource>> {
        const url = Util.apiUrl(`resource/delete-resource-by-id/${id}`);
        return await axios.delete<Partial<any>, AppResponse<any>>(url);
    }
}  