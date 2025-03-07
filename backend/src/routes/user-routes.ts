import { Router } from 'express';
import { registerUser, loginUser, userDetail, updateProfile, deleteUser, getAllUsers } from '../endpoint/user-ep';
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


export default router;
