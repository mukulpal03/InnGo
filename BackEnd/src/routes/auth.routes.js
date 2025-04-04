import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "../controllers/auth.controllers.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  validateUserRegister,
  validateUserLogin,
  validateUserForgotPass,
  validateUserResetPass,
} from "../middlewares/validator.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validateUserRegister, asyncHandler(registerUser));
router.post("/verify/:token", asyncHandler(verifyUser));
router.post("/login", validateUserLogin, asyncHandler(loginUser));
router.post("/logout", isLoggedIn, asyncHandler(logoutUser));
router.post(
  "/forgot-password",
  isLoggedIn,
  validateUserForgotPass,
  asyncHandler(forgotPassword),
);
router.post(
  "/reset-password/:token",
  isLoggedIn,
  validateUserResetPass,
  asyncHandler(resetPassword),
);

export default router;
