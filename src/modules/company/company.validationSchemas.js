import joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";

//===================addCompanySchema===================//
export const addCompanySchema =joi
  .object({
    //data from body
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi
      .array()
      .items(joi.number().required())
      .length(2)
      .required(),
    companyEmail: joi.string().email().required(),
  })
  .required();

//===================updateCompanySchema===================//
export const updateCompanySchema = joi
  .object({
    //data from body
    companyName: joi.string(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.array().items(joi.number().required()).length(2),
    companyEmail: joi.string().email(),
    //data from query
    companyId: joi.custom(objectIdValidation).required(),
  })
  .required();

//========================searchCompanySchema========================//
export const searchCompanySchema = joi
  .object({
    //data from query
    companyName: joi.string().required(),
  })
  .required();

//========================getCompanyDataSchema========================//
export const getCompanyDataSchema = joi
  .object({
    //data from params
    companyId: joi.custom(objectIdValidation).required(),
  })
  .required();

