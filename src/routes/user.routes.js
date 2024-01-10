import { Router } from "express";
import { registerUser } from "/Users/air/Desktop/Youtube Clone JS/src/controllers/user.controller.js";



const router= Router();


router.route("/register").post(registerUser);
export default router;