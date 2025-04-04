import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.model.js";
import {
  sendEmailVerificationMail,
  sendResetPasswordMail,
} from "../utils/sendMail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const registerUser = async (req, res, next) => {
  const { name, email, password, phone_no } = req.body;

  if (!name || !email || !password || !phone_no) {
    return next(new ApiError(400, "All fields are required"));
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ApiError(400, "User already exists"));
  }

  const user = await User.create({
    name,
    email,
    password,
    phone_no,
  });

  if (!user) {
    return next(new ApiError(400, "User not registered"));
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.verificationToken = token;

  await user.save();

  await sendEmailVerificationMail(token, user.email);

  res.status(200).json(new ApiResponse(200, "User registered successfully"));
};

const verifyUser = async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new ApiError(400, "Invalid Token"));
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return next(new ApiError(400, "Invalid Token"));
  }

  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(200, "User Verified successfully"));
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(401, "Invalid Email or Password"));
  }

  if (!user.isVerified) {
    return next(new ApiError(401, "Please verify your email"));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ApiError(401, "Invalid Email or Password"));
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("token", token, cookieOptions);

  res.status(200).json(new ApiResponse(200, "User Login Successful"));
};

const logoutUser = async (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("token", "", cookieOptions);

  res.status(200).json(new ApiResponse(200, "User logged Out successfully"));
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(401, "Invalid Email"));
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = token;
  user.passwordResetExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendResetPasswordMail(token, user.email);

  res.status(200).json(new ApiResponse(200, "Password Reset Email Sent!!"));
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return next(new ApiError(400, "Invalid Token"));
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ApiError(400, "Token Expired"));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(200, "Password Reset Successful"));
};

export {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
