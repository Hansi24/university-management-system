import { IResource } from "../modal/IResource";
import Resource from "../schema/Resource";

export const createResourceDao = async (resource: IResource): Promise<IResource> => {
    try {
        const newResource = new Resource(resource);
        await newResource.save();
        return newResource;
    } catch (error) {
        throw error;
    }
};

export const getAllResourcesDao = async (): Promise<IResource[]> => {
    try {
        const resources = await Resource.find();
        return resources;
    } catch (error) {
        throw error;
    }
};

export const getResourceByIdDao = async (resourceId: string): Promise<IResource> => {
    try {
        const resource = await Resource.findById(resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }
        return resource;
    } catch (error) {
        throw error;
    }
};

export const updateResourceDao = async (resourceId: string, resource: IResource): Promise<IResource> => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(resourceId, resource, { new: true });
        if (!updatedResource) {
            throw new Error('Resource not found');
        }
        return updatedResource;
    } catch (error) {
        throw error;
    }
};

export const deleteResourceDao = async (resourceId: string): Promise<IResource> => {
    try {
        const deletedResource = await Resource.findByIdAndDelete(resourceId);
        if (!deletedResource) {
            throw new Error('Resource not found');
        }
        return deletedResource;
    } catch (error) {
        throw error;
    }
}

export const getAvailableResourcesDao = async (): Promise<IResource[]> => {
    try {
        const resources = await Resource.find({ availability: true });
        return resources;
    } catch (error) {
        throw error;
    }
}

export const getResourceByTypeDao = async (type: string): Promise<IResource[]> => {
    try {
        const resources = await Resource.find({ type: type });
        return resources;
    } catch (error) {
        throw error;
    }
}

