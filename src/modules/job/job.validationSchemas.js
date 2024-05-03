import joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";
//========================addJobSchema========================//
export const addJobSchema = joi
  .object({
    //data from body
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().items(joi.string().required()).required(),
    softSkills: joi.array().items(joi.string().required()).required(),
    companyId: joi.custom(objectIdValidation).required(),
  })
  .required();

//========================updateJobSchema========================//
export const updateJobSchema = joi
  .object({
    //data from body
    jobTitle: joi.string(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().valid("part-time", "full-time"),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string().required()),
    softSkills: joi.array().items(joi.string().required()),
    companyId: joi.custom(objectIdValidation),
    //data from query
    jobId: joi.custom(objectIdValidation).required(),
  })
  .required();

//========================deleteJobSchema========================//
export const deleteJobSchema = joi
  .object({
    //data from query
    jobId: joi.custom(objectIdValidation).required(),
  })
  .required();

//========================getAllJobsForASpecificCompanySchema========================//
export const getAllJobsForASpecificCompanySchema = joi
  .object({
    //data from query
    companyName: joi.string().required(),
  })
  .required();

//========================getAllJobsThatMatchSchema========================//
export const getAllJobsThatMatchSchema = joi
  .object({
    jobTitle: joi.string(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().valid("part-time", "full-time"),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    technicalSkills: joi.array().items(joi.string().required()),
  })
  .required();

//========================applyToJobSchema========================//
export const applyToJobSchema = joi
  .object({
    //data from body
    jobId: joi.custom(objectIdValidation).required(),
    userId: joi.custom(objectIdValidation).required(),
    userTechSkills: joi.array().items(joi.string().required()).required(),
    userSoftSkills: joi.array().items(joi.string().required()).required(),
  })
  .required();
