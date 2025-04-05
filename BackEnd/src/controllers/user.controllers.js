import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.model.js";

const getProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return next(new ApiError(401, "User not found"));
  }

  res.status(200).json(
    new ApiResponse(200, `Welcome, ${user.name}`, {
      name: user.name,
      role: user.role,
    }),
  );
};

export { getProfile };
