//check if was conflect between email & mobileNumber
import User from "../../DB/models/user.model.js";
import asyncHandler from "express-async-handler";
export const conflict = asyncHandler(async (req, res, next) => {
  const { email, mobileNumber } = req.body;
  //check email
  const isUser = await User.findOne({ email });
  if (isUser) return next(new Error("Email already exists!", { cause: 409 }));

  //check mobileNumber
  const isMobileNmber = await User.findOne({ mobileNumber });
  if (isMobileNmber)
    return next(new Error("Mobile number already exists!", { cause: 409 }));

  return next();
});
