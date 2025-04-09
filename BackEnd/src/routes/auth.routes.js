import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
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
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validateUserRegister, asyncHandler(registerUser));
router.post("/verify/:token", asyncHandler(verifyUser));
router.post("/login", validateUserLogin, asyncHandler(loginUser));
router.post("/logout", isLoggedIn, asyncHandler(logoutUser));
router.get(
  "/forgot-password",
  validateUserForgotPass,
  asyncHandler(forgotPassword),
);
router.post(
  "/reset-password/:token",
  validateUserResetPass,
  asyncHandler(resetPassword),
);
router.post("/refresh-access-token", asyncHandler(refreshAccessToken));

export default router;
