import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

export const isLoggedIn = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ApiError(401, "Please Login"));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData;

  next();
};
