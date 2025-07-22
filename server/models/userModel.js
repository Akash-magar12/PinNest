import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    profileImage: {
      url: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedPins: [{ type: mongoose.Schema.Types.ObjectId, ref: "pin" }],
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpire: {
      type: Date,
      default: null,
    },
    otpCode: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);
