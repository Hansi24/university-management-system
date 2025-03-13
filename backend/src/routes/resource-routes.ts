import express from 'express';
import { createResource, deleteResource, getAllResources, getAvailableResources, getResourceById, getResourceByType, updateResource } from '../endpoint/resource-ep';
const router = express.Router();

router.post('/', createResource);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.patch('/:id', updateResource);
router.delete('/:id', deleteResource);
router.get('/available', getAvailableResources);
router.get('/type/:type', getResourceByType);

export default router;