import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.model.js";
import {
  emailVerificationMailGenContent,
  sendMail,
  resetPasswordMailGenContent,
} from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

async function generateAccessAndRefreshToken(userId) {
  const user = await User.findById(userId).select("-password");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save();

  return { accessToken, refreshToken };
}

const registerUser = async (req, res, next) => {
  const { name, email, password, phone_no } = req.body;

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

  const { token, tokenExpiry } = user.generateTemporaryToken();

  user.verificationToken = token;
  user.verificationTokenExpiry = tokenExpiry;

  await user.save();

  await sendMail({
    email: user.email,
    subject: "Verify your email",
    mailGenContent: emailVerificationMailGenContent(
      user.name,
      `${process.env.BASE_URL}/api/v1/users/verify/${token}`,
    ),
  });

  res.status(200).json(new ApiResponse(200, "User registered successfully"));
};

const verifyUser = async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new ApiError(400, "Invalid Token"));
  }

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ApiError(400, "Invalid Token"));
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(200, "User Verified successfully"));
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(401, "Invalid Email or Password"));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ApiError(401, "Invalid Email or Password"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, "User Login Successful"));
};

const logoutUser = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ApiError(401, "Please login"));
  }

  user.refreshToken = null;

  await user.save();

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, "User logged Out successfully"));
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select("-password -refreshToken");

  if (!user) {
    return next(new ApiError(401, "Invalid Email"));
  }

  const { token, tokenExpiry } = user.generateTemporaryToken();

  user.passwordResetToken = token;
  user.passwordResetExpiry = tokenExpiry;

  await user.save();

  await sendMail({
    email: user.email,
    subject: "Reset your password",
    mailGenContent: resetPasswordMailGenContent(
      user.name,
      `${process.env.BASE_URL}/api/v1/users/reset-password/${token}`,
    ),
  });

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

const refreshAccessToken = async (req, res, next) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;

  if (!token) {
    return next(new ApiError(401, "Invalid refresh Token"));
  }

  const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select("-password");

  if (!user) {
    return next(new ApiError(401, "Invalid refresh Token"));
  }

  if (token !== user?.refreshToken) {
    return next(new ApiError(401, "Invalid refresh Token"));
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, newRefreshToken } =
    await generateAccessAndRefereshTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed",
      ),
    );
};

export {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
