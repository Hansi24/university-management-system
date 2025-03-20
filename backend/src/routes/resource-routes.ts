import express from 'express';
import { createResource, deleteResource, getAllResources, getAvailableResources, getBookedResource, getRequestedResource, getResourceById, getResourceByType, resourceBooking, updateResource, updateResourceStatus } from '../endpoint/resource-ep';
import { Util } from '../utils/util';
const router = express.Router();

router.post('/create-resource', Util.withErrorHandling(createResource));
router.get('/get-all-resource', Util.withErrorHandling(getAllResources));
router.get('/get-requested-resource', Util.withErrorHandling(getRequestedResource)); // Specific route first
router.get('/get-resource-by-id/:id', Util.withErrorHandling(getResourceById)); // Generic route last
router.patch('/update-resource-by-id/:id', Util.withErrorHandling(updateResource));
router.delete('/delete-resource-by-id/:id', Util.withErrorHandling(deleteResource));
router.post('/get-available-resources', Util.withErrorHandling(getAvailableResources));
router.get('/get-resource-by-type/:type', Util.withErrorHandling(getResourceByType));
router.post('/book/resource-booking', Util.withErrorHandling(resourceBooking));
router.get('/get-booked-resource/:userId', Util.withErrorHandling(getBookedResource));
router.put('/update-requested-resource-status/status/:bookedId', Util.withErrorHandling(updateResourceStatus));


export default router;