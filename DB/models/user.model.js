import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    username: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    recoveryEmail: {
      type: String,
      required: true,
    },
    DOB: {
      type: String,
      required: true,
    },
    mobileNumber: { type: String, unique: true },
    role: {
      type: String,
      enum: ["User", "Company_HR"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    otp: Number,
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
