import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        trim:true,
        required:true,
        index:true,
        lowercase:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true
    },
    fullName:{
        type:String,
        required:true,
        lowercase:true,
    },
    password:{
        required:true,
        type:String
    },
    refreshToken:{
        type:String
    },
    avtar:{
        type:string,
        required:true
    },
    coverAvtar:{
        type:String,
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"video"
        }
    ]

}, { timestamps: true });

export const user = mongoose.model("user", userSchema);
