import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshAccessToken } from "/Users/air/Desktop/Youtube Clone JS/src/controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js';
import { ApiError } from "/Users/air/Desktop/Youtube Clone JS/utils/ApiError.js";
import { verifyJWT } from '../middlewares/auth.middlware.js';

const router= Router();

router.route("/register").post(upload.fields([
    {
        name: 'avatar',
        maxCount: 2,
    },
    {
        name: 'coverimage',
        maxCount: 2,
    }
]), registerUser);



router.route("/login").post(loginUser);
export default router;

router.route('/logout').post(verifyJWT,logoutUser);

router.route('/refreshToken').post(refreshAccessToken);