import asyncHandler from "../utils/asyncHandeller.js";
import { user } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const userRegister = asyncHandler(async (req, res, next) => {
  const { username, email, fullName, avtar, coverAvtar, password } = req.body;
  console.log(username);
  //   check fields

  if (
    [username, email, fullName, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "all fields are required not be empty");
  }

  const checkUserIsAlreadyRegisterOrNot = await user.findOne({
    $or: [{ username }, { email }],
  });
  if (checkUserIsAlreadyRegisterOrNot) {
    throw new ApiError(400, "user is already register");
  }

  const avatarImage = req?.files?.avtar[0]?.path;
  const coverImage = req?.files?.coverAvtar[0]?.path;
  res.status(200).json(new ApiResponse(200, "user register succsessfully"));
});

export { userRegister };
