import jwt from "jsonwebtoken";
import User from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import moment from "moment";
import { generateOTP } from "../../utils/generateOTP.js";

//========================signup========================//
export const signup = async (req, res, next) => {
  const { firstName, lastName, DOB } = req.body;

  //username concatination
  const username = firstName + " " + lastName;

  //hashed password
  const hashedPassword = bcrypt.hashSync(
    req.body.password,
    +process.env.SALT_ROUNDS
  );

  //formated date
  const formatedDOB = moment(DOB).format("YYYY-MM-DD");

  //create user
  const createUser = await User.create({
    ...req.body,
    password: hashedPassword,
    DOB: formatedDOB,
    username,
  });
  //failed case
  if (!createUser)
    return next(new Error("User registration failed", { cause: 400 }));

  //success case and return response
  return res.status(201).json({
    success: true,
    message: "User registrater successfully!",
  });
};

//========================signin========================//
export const signin = async (req, res, next) => {
  const { email, password, mobileNumber } = req.body;
  //check email or mobileNumber

  const isUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (!isUser)
    return next(new Error("Invalid email or mobile number", { cause: 404 }));

  //check password
  const isPasswordMatch = bcrypt.compareSync(password, isUser.password);
  if (!isPasswordMatch)
    return next(new Error("Invalid user credentials", { cause: 400 }));

  //generate token
  const token = jwt.sign(
    { id: isUser._id, email: isUser.email },
    process.env.TOKEN_SECRET
  );

  //update the status to online
  await User.findByIdAndUpdate(isUser._id, { status: "online" });
  //send respose
  return res.status(200).json({ success: true, token });
};

//========================update user========================//
export const updateUser = async (req, res, next) => {
  //destruct data from body
  const { email, firstName, lastName, mobileNumber, DOB, recoveryEmail } =
    req.body;
  //get user
  const user = await User.findById(req.user._id);

  //check if email has changed
  if (email) user.email = email;
  //check if mobileNumber has changed
  if (mobileNumber) user.mobileNumber = mobileNumber;
  //check if recoveryEmail has changed
  if (recoveryEmail) user.recoveryEmail = recoveryEmail;
  //check if firstName has changed
  if (firstName) {
    user.firstName = firstName;
    user.username = firstName + " " + user.lastName;
  }
  //check if lastName has changed
  if (lastName) {
    user.lastName = lastName;
    user.username = user.firstName + " " + lastName;
  }

  //check changes in DOB
  if (DOB) user.DOB = moment(DOB).format("YYYY-MM-DD");

  //update user
  const updatedUser = await user.save();
  if (!updatedUser) return next(new Error("Updated fail", { cause: 400 }));
  //send response
  return res.status(200).json({ message: "User updated successfully!" });
};

//========================delete user========================//
export const deleteUser = async (req, res, next) => {
  //delete user
  const deletedUser = await User.findByIdAndDelete(req.user._id);
  if (!deletedUser) return next(new Error("delete fail", { cause: 400 }));

  return res.status(200).json({
    success: true,
    message: "User deleted success!",
  });
};

//========================Get  user account data========================//
export const getAccountData = async (req, res, nenx) => {
  //get user account data
  const userData = await User.findById(req.user._id);
  //send response
  return res.status(200).json({
    success: true,
    userData,
  });
};

//========================Get profile data for another user ========================//
export const dataForAnotherUser = async (req, res, next) => {
  //search user with id from params
  const isUser = await User.findById(req.params.userId);
  //if user not found
  if (!isUser) return next(new Error("User not found", { cause: 404 }));
  //return response
  return res.status(200).json({
    success: true,
    isUser,
  });
};

//========================cahnge password========================//
export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const userID = req.user._id;
  const user = await User.findById(userID);
  //check current password
  const isPasswordMatch = bcrypt.compareSync(currentPassword, user.password);
  if (!isPasswordMatch)
    return next(new Error("Invalid current password", { cause: 400 }));

  //hashed new password
  const hashedNewPassword = bcrypt.hashSync(
    newPassword,
    +process.env.SALT_ROUNDS
  );
  //save change in DB
  const updatedPassword = await User.findByIdAndUpdate(userID, {
    password: hashedNewPassword,
  });
  if (!updatedPassword) {
    return next(new Error("Change password is faild", { cause: 400 }));
  }
  //send respons
  return res.status(200).json({ message: "Password changed successfully!" });
};

//========================forget password========================//
export const forgetPassword = async (req, res, next) => {
  //check user
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User not found!", { cause: 404 }));
  //generate random OTP
  const otp = generateOTP();
  user.otp = otp;
  //save otp in DB
  const saveOTP = await user.save();
  if (!saveOTP) return next(new Error("Save OTP is failed", { cause: 400 }));
  //send response
  return res
    .status(200)
    .json({ success: true, message: "OTP generated successfully.", otp });
};
//========================reset password========================//
export const resetPassword = async (req, res, next) => {
  //destructing data from body
  const { email, otp, newPassword } = req.body;
  //check if email&otp if matched with DB
  const user = await User.findOne({ email, otp });
  if (!user)
    return next(
      new Error("Email or OTP code is invalid , try again!", { cause: 400 })
    );
  //generate current time to validate OTP
  const currentTime = Date.now();
  //get time that OTP generated
  const otpTimestamp = user.updatedAt;
  //OTP Validity Duration
  const otpValidityDuration = 60 * 10 * 1000; // OTP code valid for 2 mins
  //check if otp is validate
  if (currentTime - otpTimestamp > otpValidityDuration) {
    return next(new Error("Expired OTP code "));
  }
  //hashed new password
  const hashedNewPassword = bcrypt.hashSync(
    newPassword,
    +process.env.SALT_ROUNDS
  );
  //save change in DB
  const updatedPassword = await User.findByIdAndUpdate(user._id, {
    password: hashedNewPassword,
    otp: null,
  });
  if (!updatedPassword) {
    return next(new Error("Set password is faild", { cause: 400 }));
  }
  //send respons
  return res.status(200).json({ message: "Password changed successfully!" });
};

//========================Get all accounts associated to a specific recovery Email========================//
export const allAccountsToSpecificRecoveryEmail = async (req, res, next) => {
  //search with recovery Email
  const users = await User.find({ recoveryEmail: req.body.recoveryEmail });
  //if recovery email not found
  if (!users.length)
    return next(
      new Error(
        `There are no accounts associated to this recovery email : ${req.body.recoveryEmail}`,
        { cause: 404 }
      )
    );
  //return response
  return res.status(200).json({
    success: true,
    accounts: { users },
  });
};
