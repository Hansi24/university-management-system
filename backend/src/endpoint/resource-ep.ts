import { NextFunction, Request, Response } from "express";
import { Util } from "../utils/util";
import { IResource } from "../modal/IResource";
import { createResourceDao, deleteResourceDao, getAllResourcesDao, getAvailableResourcesDao, getResourceByIdDao, getResourceByTypeDao, updateResourceDao } from "../dao/resource-dao";

export const createResource = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
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
        const resources = await getAvailableResourcesDao();
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