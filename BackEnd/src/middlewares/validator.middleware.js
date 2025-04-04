import { z } from "zod";
import { ApiError } from "../utils/api-error.js";

const validateUserRegister = (req, res, next) => {
  const validateSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Name should be atleast 2 characters" })
      .max(30, { message: "Name cannot exceed 30 Characters" })
      .trim(),
    email: z.string().email({ message: "Invalid Email" }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" })
      .max(30, { message: "Password cannot exceed 30 characters" }),
    phone_no: z.string().length(10, { message: "Phone no is incorrect" }),
  });

  const validateData = validateSchema.safeParse(req.body);

  if (!validateData.success) {
    return next(
      new ApiError(
        401,
        "Invalid Credentials",
        validateData.error.issues[0].message,
      ),
    );
  }

  next();
};

const validateUserLogin = (req, res, next) => {
  const validateSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" })
      .max(30, { message: "Password cannot exceed 30 characters" }),
  });

  const validateData = validateSchema.safeParse(req.body);

  if (!validateData.success) {
    return next(
      new ApiError(
        401,
        "Invalid Credentials",
        validateData.error.issues[0].message,
      ),
    );
  }

  next();
};

const validateUserForgotPass = (req, res, next) => {
  const validateSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }),
  });

  const validateData = validateSchema.safeParse(req.body);

  if (!validateData.success) {
    return next(
      new ApiError(
        401,
        "Invalid Credentials",
        validateData.error.issues[0].message,
      ),
    );
  }

  next();
};

const validateUserResetPass = (req, res, next) => {
  const validateSchema = z.object({
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" })
      .max(30, { message: "Password cannot exceed 30 characters" }),
  });

  const validateData = validateSchema.safeParse(req.body);

  if (!validateData.success) {
    return next(
      new ApiError(
        401,
        "Invalid Credentials",
        validateData.error.issues[0].message,
      ),
    );
  }

  next();
};

export { validateUserRegister, validateUserLogin, validateUserForgotPass, validateUserResetPass };
