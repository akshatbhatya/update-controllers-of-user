import asyncHandler from "../utils/asyncHandeller.js";
import { user } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadLocalFile from "../utils/cloudinary.js";

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
  const uploadAvtarImage = await uploadLocalFile(avatarImage);
  const uploadCoverImage = await uploadLocalFile(coverImage);
  if (!uploadAvtarImage) {
    throw new ApiError(400, "avatar image is required");
  }
  const newUser = {
    fullName: fullName?.toLowerCase(),
    email: email?.trim()?.toLowerCase(),
    username: username?.trim()?.toLowerCase(),
    avtar: uploadAvtarImage.url,
    coverAvtar: uploadCoverImage.url || "",
    password,
  };

  const createdUser = await user.create(newUser);
  if (!createdUser) {
    throw new ApiError(500, "user is not created successfully");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "user register succsessfully", {}));
});

const logIn = asyncHandler(async (req, res) => {});

export { userRegister, logIn };
