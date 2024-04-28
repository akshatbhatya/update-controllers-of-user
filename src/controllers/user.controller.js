import asyncHandler from "../utils/asyncHandeller.js";
import {user} from "../models/user.model.js";
const userRegister = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;
  console.log(username);
});

export { userRegister };
