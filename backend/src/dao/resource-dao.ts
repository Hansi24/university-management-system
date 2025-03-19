import { ObjectId, Types } from "mongoose";
import { sendResourceBookingRequestEmail } from "../email/requestProposal-email";
import { BookingStatus } from "../enums/BookingStatus";
import { AdminType } from "../enums/UserEnums";
import { IResource } from "../modal/IResource";
import { IResourceBooking } from "../modal/IResourceBooking";
import Resource from "../schema/Resource";
import ResourceBooking from "../schema/ResourceBooking";
import { User } from "../schema/User";

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

export const getAvailableResourcesDao = async (startTime: string, endTime: string): Promise<IResource[]> => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
  
      // Fetch all resource bookings that overlap with the given time range
      const bookings = await ResourceBooking.find({
        startTime: { $lt: end },
        endTime: { $gt: start },
        status: BookingStatus.APPROVED
      }).select("resourceId");
  
      // Extract booked resource IDs
      const bookedResourceIds = new Set(bookings.map((booking) => booking.resourceId.toString()));
  
      // Fetch all resources
      const allResources = await Resource.find({availability: true});
  
      // Construct the resource availability response
      const updatedResources = allResources.map((resource) => ({
        ...resource.toObject(),
        availability: !bookedResourceIds.has(resource._id.toString()), // Available if not booked in the time range
      }));
  
      return updatedResources;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw new Error("An error occurred while fetching resources.");
    }
  };
  

export const getResourceByTypeDao = async (type: string): Promise<IResource[]> => {
    try {
        const resources = await Resource.find({ type: type });
        return resources;
    } catch (error) {
        throw error;
    }
}
export const getBookedResourceDao = async (userId: Types.ObjectId): Promise<IResourceBooking[]> => {
    try {
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }
        const resources = await ResourceBooking.find({ userId: userId }).populate({
            path: "resourceId",
            select: "name", // Exclude the password field
        })
        .exec();
        return resources;
    } catch (error) {
        throw error;
    }
}

export const resourceBookingDao = async (resourceBooking: IResourceBooking): Promise<IResourceBooking> => {
    try {
        const existingUser = await User.findById({_id:resourceBooking.userId}) 
        const existingResource = await Resource.findById({ _id: resourceBooking.resourceId});
        const ResourceAdmin = await User.findOne({ type : AdminType.RESOURCE})
        if (!ResourceAdmin) {
            throw new Error('Resource admin not found');
        }
        if (!existingUser) {
            throw new Error('User not found');
        }
        if (!existingResource) {
            throw new Error('Resource not found');
        }
        const newResourceBooking = new ResourceBooking(resourceBooking);
        await newResourceBooking.save();
        await sendResourceBookingRequestEmail(ResourceAdmin.email, existingResource.name,newResourceBooking,existingUser);
        return newResourceBooking;
    } catch (error) {
        throw error;
    }
}

export const getRequestedResourceDao = async (): Promise<IResourceBooking[]> => {
    try {
        const requestedResources = await ResourceBooking.find();
        return requestedResources;
    } catch (error) {
        throw error;
    }
}
export const updateResourceStatusDao = async (bookedId:string, bookingStatus:BookingStatus): Promise<IResourceBooking> => {
    try {
        const bId = new Types.ObjectId(bookedId);
        const requestedResource = await ResourceBooking.findById({_id: bId});
        if (!requestedResource) {
            throw new Error('Booking not found');
        }
        requestedResource.status = bookingStatus;
        await requestedResource.save();
        return requestedResource;
    } catch (error) {
        throw error;
    }
}