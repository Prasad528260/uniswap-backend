import express from "express";
import { signupController,loginController,logoutController } from "../controllers/authController.js";
import { userAuth } from "../middlewares/userAuth.js";
const authRouter = express.Router();

// * Signup
authRouter.post("/signup",signupController);

// * Login
authRouter.post("/login",loginController);

// * Logout
authRouter.post("/logout",logoutController);

export default authRouter;
