import express from 'express';
import { createResource, deleteResource, getAllResources, getAvailableResources, getBookedResource, getResourceById, getResourceByType, resourceBooking, updateResource } from '../endpoint/resource-ep';
import { Util } from '../utils/util';
const router = express.Router();

router.post('/', Util.withErrorHandling(createResource));
router.get('/', Util.withErrorHandling(getAllResources));
router.get('/:id', Util.withErrorHandling(getResourceById));
router.patch('/:id', Util.withErrorHandling(updateResource));
router.delete('/:id', Util.withErrorHandling(deleteResource));
router.post('/available', Util.withErrorHandling(getAvailableResources));
router.get('/type/:type', Util.withErrorHandling(getResourceByType));
router.post('/resource-booking', Util.withErrorHandling(resourceBooking));
router.get('/get-booked-resource/:userId', Util.withErrorHandling(getBookedResource));

export default router;