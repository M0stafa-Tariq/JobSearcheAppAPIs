import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../DB/models/user.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;
  //check token
  if (!token) return next(new Error("token required", { cause: 400 }));

  //check prefix
  if (!token.startsWith(process.env.BEARER_KEY))
    return next(new Error("Invalid token!", { cause: 400 }));

  //split token
  token = token.split(process.env.BEARER_KEY)[1];

  //verify token
  const payload = jwt.verify(token, process.env.TOKEN_SECRET);

  //check user
  const isUser = await User.findById(payload.id);
  if (!isUser) return next(new Error("User not found", { cause: 404 }));

  //pass user to the next controller
  req.user = isUser;

  //call the next controller
  return next();
});
