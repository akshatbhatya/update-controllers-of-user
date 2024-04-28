import asyncHandler from "../utils/asyncHandeller";
import user from "../models/user.model"
const userRegister=asyncHandler(async(req,res,next)=>{

    const {username,email}=req.body;
    console.log(username);

});

export {userRegister};