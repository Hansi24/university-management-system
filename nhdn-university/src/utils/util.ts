import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { IUser } from "../models/User";

const apiUrl = import.meta.env.VITE_API_URL;
export class Util {
    // private static token: string;
    // private static role: string;

    public static setToken(tk: string): void {
        localStorage.setItem('token', tk);
        Util.setRole(tk);
    }
    public static getToken(): string {
        return localStorage.getItem('token') ?? "";
        // return Util.token;
    }
    public static setRole(tk: string): void {
        // try {
        //     const role: IUser = jwtDecode(tk);
        //     console.log(role);
        //     Util.role = role.userRole ?? "";
        // } catch (error) {
        //     console.error("Invalid token specified:", error);
        //     Util.role = "";
        // }
        const role: IUser = jwtDecode(tk);
        localStorage.setItem("role", role.userRole ?? "");
        localStorage.setItem("userId", role.userId ?? "");
        localStorage.setItem("userType", role.userType ?? "");
    }
    public static getRole(): string {
        return localStorage.getItem('role') ?? "";
        // return Util.role;
    }
    
    public static apiPublicUrl(path: string): string {
        return apiUrl + '/public/' + path;
    }

    public static apiAuthUrl(path: string): string {
        return apiUrl + '/auth/' + path;
    }
    public static apiAuthAdminUrl(path: string): string {
        return apiUrl + '/api/admin/' + path;
    }
    public static apiUrl(path: string): string {
        return apiUrl + '/api/' + path;
    }

    public static apiEstimatorUrl(path: string): string {
        return apiUrl + '/api/estimator/' + path;
    }

    public static initAxios(): void {
        
        axios.interceptors.request.use(req => {
            console.log(this.getToken());
            req.headers.Authorization = 'Bearer ' + this.getToken();
            return req;
        });

        axios.interceptors.response.use(function (response) {
                return response.data;
        }, function (error) {
            return {success: false, data: undefined, error: error};
        });
    }
}

Util.initAxios();
