import express from 'express';
import { Util } from '../utils/util';
import { createMaterial, createSubmission, deleteMaterial, deleteSubmission, getLatestAssignments, getMaterial, getMaterialById, getSubmissionByAssignmentId, getSubmissionById, hasSubmitted, updateMaterial, updateSubmission } from '../endpoint/module-ep';
const router = express.Router();

router.post('/create-material', Util.withErrorHandling(createMaterial));
router.patch('/update-materials/:materialId', Util.withErrorHandling(updateMaterial));
router.get('/material/:materialId', Util.withErrorHandling(getMaterialById));
router.delete('/:materialId', Util.withErrorHandling(deleteMaterial));
router.post('/submission', Util.withErrorHandling(createSubmission));
router.get('/submission/:submissionId', Util.withErrorHandling(getSubmissionById));
router.patch('/:submissionId', Util.withErrorHandling(updateSubmission));
router.delete('/:submissionId', Util.withErrorHandling(deleteSubmission));
router.get('/get-submission-by-assignmentId/:assignmentId', Util.withErrorHandling(getSubmissionByAssignmentId));
router.get('/get-materials/:moduleId', Util.withErrorHandling(getMaterial));
router.get("/materials/:materialId/has-submitted", Util.withErrorHandling(hasSubmitted));
router.get("/latest-assignments/by-user", Util.withErrorHandling(getLatestAssignments));




export default router;