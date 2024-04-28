import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      required: true,
      type: String,
    },
    refreshToken: {
      type: String,
    },
    avtar: {
      type: String,
      required: true,
    },
    coverAvtar: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// add jwt

// add ACCESS TOKEN

userSchema.methods.generateAccessToken = async function () {
  await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      username: this.username,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: process.env.EXPIRE_ACESS_TOKEN,
    }
  );
};

// add refresh token
userSchema.methods.generateRefreshToken = async function () {
  await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: process.env.EXPIRE_REFRESH_TOKEN,
    }
  );
};

export const user = mongoose.model("user", userSchema);
