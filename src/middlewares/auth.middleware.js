import { user } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandeller.js";
import jwt from "jsonwebtoken";
asyncHandler(async (req, res, next) => {
  try {
    let TokenuserId = req?.cookies?.accessToken;
    if (!TokenuserId) {
      throw new ApiError(400, " there is no access token here");
    }
    let veriFiedToken = jwt.verify(TokenuserId, process.env.ACCESS_TOKEN);
    if(!veriFiedToken){
        throw new ApiError(400,"unauthorized request")
    }
    let generatedUser = await user
      .findById(veriFiedToken._id)
      .select("-password -refreshToken");
    if (!generatedUser) {
      throw new ApiError(400, "user from access token is not found");
    }
    req.user = generatedUser;
    next();
  } catch (error) {
    throw new ApiError(400, error?.message);
  }
});
