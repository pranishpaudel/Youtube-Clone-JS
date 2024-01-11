import { Router } from "express";
import { registerUser } from "/Users/air/Desktop/Youtube Clone JS/src/controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js';
import { ApiError } from "/Users/air/Desktop/Youtube Clone JS/utils/ApiError.js";

const router= Router();

router.route("/register").post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1,
    },
    {
        name: 'coverImage',
        maxCount: 1,
    }
]), registerUser);

export default router;