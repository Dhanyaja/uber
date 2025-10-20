import express from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const userRoute = express.Router();

userRoute.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
  ],
  userController.registerUser
);

userRoute.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser
);

userRoute.get("/profile", authUser, userController.getUserProfile)
userRoute.get('/logout', authUser, userController.logoutUser);

export default userRoute;
