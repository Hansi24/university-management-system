import { Router } from 'express';
import { registerUser, loginUser, userDetail, updateProfile, deleteUser, getAllUsers, changePassword, resetPassword, getUsersByUserRole, getUsers, makeRep, upgradeSemester, getUserById } from '../endpoint/user-ep';
import { Util } from '../utils/util';
import { Helper } from '../utils/helper';
import upload from "../middlewares/multer";

const router = Router();

router.post('/register', upload.single("profilePic"), Util.withErrorHandling(registerUser));
router.post('/login', Util.withErrorHandling(loginUser));
router.get('/user-details', Helper.verifyToken, Util.withErrorHandling(userDetail));
router.patch('/update-user-profile', Helper.verifyToken, upload.single("profilePic"), Util.withErrorHandling(updateProfile));
router.delete('/:id', Helper.verifyToken, Util.withErrorHandling(deleteUser));
router.get('/all-users', Helper.verifyToken, Util.withErrorHandling(getAllUsers));
router.get('/:userRole', Helper.verifyToken, Util.withErrorHandling(getUsersByUserRole));
router.post('/changePassword', Helper.verifyToken, Util.withErrorHandling(changePassword));
router.post('/resetPassword', Util.withErrorHandling(resetPassword));
router.get('/get-users/:batch?/:courseId', Helper.verifyToken, Util.withErrorHandling(getUsers));
router.put('/make-rep', Helper.verifyToken, Util.withErrorHandling(makeRep));
router.put('/upgrade-semester/:userId', Helper.verifyToken, Util.withErrorHandling(upgradeSemester));
router.get('/student-details/:userId', Helper.verifyToken, Util.withErrorHandling(getUserById));


export default router;
