import asyncHandler from "express-async-handler";
import joi from "joi";
import { objectIdValidation } from "./validation.middleware.js";
import Company from "../../DB/models/company.model.js";

//company owner verification
export const companyOwnerVerification = asyncHandler(async (req, res, next) => {
  //validation companyId
  //1-schema
  const companyIdSchema = joi
    .object({
      //data from query
      companyId: joi.custom(objectIdValidation).required(),
    })
    .required();
  //2-validate
  const validationResult = companyIdSchema.validate(req.query);
  if (validationResult.error)
    return next(new Error(validationResult.error.details[0].message));
  //get company
  const company = await Company.findById(req.query.companyId);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  //check if current user is owner
  if (req.user._id.toString() != company.companyHR.toString()) {
    return next(
      new Error("You are not owner for this company!", { cause: 404 })
    );
  }
  //go to next middleware
  return next();
});
