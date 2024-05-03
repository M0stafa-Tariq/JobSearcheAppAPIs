import joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";

//===================signupSchema===================//
export const signupSchema = joi
  .object({
    //data from body
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    username: joi.string(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    recoveryEmail: joi.string().email().required(),
    DOB: joi.string().required(),
    role: joi.string().valid("User", "Company_HR"),
    mobileNumber: joi.string().required(),
  })
  .required();

//===================loginSchema===================//
export const loginSchema = joi
  .object({
    //data from body
    email: joi.string().email(),
    mobileNumber: joi.string(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  })
  .required();

//===================updateUserSchema===================//
export const updateUserSchema = joi
  .object({
    //data from body
    email: joi.string().email(),
    mobileNumber: joi.string(),
    recoveryEmail: joi.string().email(),
    DOB: joi.string(),
    firstName: joi.string(),
    lastName: joi.string(),
    role: joi.string().valid("User", "Company_HR"),
    //data from query
    ownerId: joi.custom(objectIdValidation),
  })
  .required();

//===================changePasswordSchema===================//
export const changePasswordSchema = joi
  .object({
    //data from body
    currentPassword: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    newPassword: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
    //data from query
    ownerId: joi.custom(objectIdValidation),
  })
  .required()
  .with("currentPassword", "newPassword");

//=================getDataForAnotherUserSchema==============//
export const getDataForAnotherUserSchema = joi
  .object({
    //data from params
    userId: joi.custom(objectIdValidation).required(),
  })
  .required();

//========================GetAllAccountsAssociatedTASpecificRecoveryEmailSchema========================//
export const getDataForSpecificRecoveryEmailSchema = joi
  .object({
    //data from body
    recoveryEmail: joi.string().email().required(),
  })
  .required();

//========================forget password========================//
export const forgetPasswordSchema = joi
  .object({
    //data from body
    email: joi.string().email().required(),
  })
  .required();

//========================reset password========================//
export const resetPasswordSchema = joi
  .object({
    //data from body
    email: joi.string().email().required(),
    otp: joi.number().required(),
    newPassword: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();
