import asyncHandler from "../utils/asyncHandeller.js";
import { user } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadLocalFile from "../utils/cloudinary.js";

const generateTokens = async (userId) => {
  try {
    const currentUser = await user.findById(userId);
    const accessToken = await currentUser.generateAccessToken();
    const refreshToken = await currentUser.generateRefreshToken();
    currentUser.refreshToken = refreshToken;
    await currentUser.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "token can't be generated");
  }
};

const userRegister = asyncHandler(async (req, res, next) => {
  const { username, email, fullName, avtar, coverAvtar, password } = req.body;

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

  const avatarImage = req?.files?.avtar?.[0]?.path;
  const coverImage = req?.files?.coverAvtar?.[0]?.path;

  console.log(coverImage);

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

const logIn = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username else email is required");
  }

  if (!password) {
    throw new ApiError(400, "password is required");
  }
  const isExistaceUser = await user.findOne({
    $or: [{ username }, { email }],
  });

  if (!isExistaceUser) {
    throw new ApiError(400, "user not found");
  }

  // check password

  const checkPassword = await isExistaceUser.comparePassword(password);

  if (!checkPassword) {
    throw new ApiError(400, "password is wrong");
  }
  const { accessToken, refreshToken } = await generateTokens(
    isExistaceUser._id
  );

  const logInedUser = await user
    .findById(isExistaceUser._id)
    .select("-password -refreshToken");

  const httpOptions = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, httpOptions)
    .cookie("refreshToken", refreshToken, httpOptions)
    .json(
      new ApiResponse(200, "user logged in sucessfully", {
        data: logInedUser,
        accessToken,
        refreshToken,
      })
    );
});

const logOut = asyncHandler(async (req, res) => {
  let currentUser = req.user;
  let userData = await user.findByIdAndUpdate(
    currentUser._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const httpOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .send(200)
    .clearCookie("accessToken", httpOptions)
    .clearCookie("refreshToken", httpOptions)
    .json(new ApiResponse(200, "user loged out", {}));
});

export { userRegister, logIn, logOut };
