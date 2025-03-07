import axios from "axios";
import { AppResponse } from "../models/Response";
import { Util } from "../utils/util";



export class AuthService {
    public static async Register(data: any): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl("register");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async Login(data: any): Promise<AppResponse<any>> {
        const url = Util.apiAuthUrl("login");
        return await axios.post<Partial<any>, AppResponse<any>>(url, data);
    }
    public static async Questions(providerType: string): Promise<AppResponse<any>> {
        console.log("provider", providerType);
        const url = Util.apiAuthUrl("generate-questions");
        return await axios.post<Partial<any>, AppResponse<any>>(url, { providerType });
    }
}  