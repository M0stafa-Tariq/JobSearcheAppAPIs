import joi from "joi";
import { objectIdValidation } from "./validation.middleware.js";
import asyncHandler from "express-async-handler";

//user owner verification
//use after isAuthenticated middleware
export const userOwnerwnerVerification = asyncHandler((req, res, next) => {
  //validation ownerId
  //1-schema
  const ownerIdSchema = joi
    .object({
      //data from query
      ownerId: joi.custom(objectIdValidation).required(),
    })
    .required();
  //2-validate
  const validationResult = ownerIdSchema.validate(req.query);
  if (validationResult.error)
    return next(new Error(validationResult.error.details[0].message));
//check if current user is owner
  if (req.user._id != req.query.ownerId)
    return next(new Error("You aren't the owner", { cause: 401 }));
  return next();
});
