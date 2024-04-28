import mongoose from "mongoose";

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
      type: string,
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


export const user = mongoose.model("user", userSchema);
