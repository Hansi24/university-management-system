import { NextFunction, Request, Response } from "express";
import { Util } from "../utils/util";
import { IResource } from "../modal/IResource";
import { createResourceDao, deleteResourceDao, getAllResourcesDao, getAvailableResourcesDao, getBookedResourceDao, getResourceByIdDao, getResourceByTypeDao, resourceBookingDao, updateResourceDao } from "../dao/resource-dao";
import { AdminType, Role, StudentType } from "../enums/UserEnums";
import { promises } from "dns";
import { IResourceBooking } from "../modal/IResourceBooking";
import { Types } from "mongoose";

export const createResource = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
        if (!(req.user.userRole === Role.ADMIN && req.user.userType === AdminType.RESOURCE)) {
            return Util.sendError(res, "You are not authorized to create resources", 401);
        }        
        const resource = await createResourceDao(req.body as IResource);
        return Util.sendSuccess(res, resource, "Resource created successfully");
    } catch (error) {
        next(error);
    }
}

export const getAllResources = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
        const resources = await getAllResourcesDao();
        return Util.sendSuccess(res, resources, "Resources fetched successfully");
    } catch (error) {
        next(error);
    }
}

export const getResourceById = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const resource = await getResourceByIdDao(req.params.id);
        return Util.sendSuccess(res, resource, "Resource fetched successfully");
    } catch (error) {
        next(error);
    }
}

export const updateResource = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const updatedResource = await updateResourceDao(req.params.id, req.body as IResource);
        return Util.sendSuccess(res, updatedResource, "Resource updated successfully");
    } catch (error) {
        next(error);
    }
}

export const deleteResource = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const deletedResource = await deleteResourceDao(req.params.id);
        return Util.sendSuccess(res, deletedResource, "Resource deleted successfully");
    } catch (error) {
        next(error);
    }
}

export const getAvailableResources = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const { startTime, endTime } = req.body;
        const resources = await getAvailableResourcesDao(startTime, endTime);
        return Util.sendSuccess(res, resources, "Available resources fetched successfully");
    } catch (error) {
        next(error);
    }
}

export const getResourceByType = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const resources = await getResourceByTypeDao(req.params.type);
        return Util.sendSuccess(res, resources, "Resources fetched successfully");
    } catch (error) {
        next(error);
    }
}
export const getBookedResource = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const userId = req.user.userId;
        const resources = await getBookedResourceDao(userId);
        return Util.sendSuccess(res, resources, "Resources fetched successfully");
    } catch (error) {
        next(error);
    }
}

export const resourceBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.user.userRole !== Role.LECTURER && !(req.user.userRole === Role.STUDENT && req.user.userType === StudentType.REP)) {
            return Util.sendError(res, "You are not authorized to book resources", 401);
        }   
        const userId: Types.ObjectId = req.user.userId;
        const resourceBooking: IResourceBooking = { ...req.body, userId };
        const booking = await resourceBookingDao(resourceBooking);
        return Util.sendSuccess(res, booking, "Resource booking successful");
    } catch (error) {
        next(error);
    }
};