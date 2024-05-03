import asyncHandler from "express-async-handler";
import joi from "joi";
import { objectIdValidation } from "./validation.middleware.js";
import Job from "../../DB/models/job.model.js";


//job owner verification
export const jobOwnerVerification = asyncHandler(async (req, res, next) => {
    //validation companyId
    //1-schema
    const jobIdSchema = joi
      .object({
        //data from query
        jobId: joi.custom(objectIdValidation).required(),
      })
      .required();
    //2-validate
    const validationResult = jobIdSchema.validate(req.query);
    if (validationResult.error)
      return next(new Error(validationResult.error.details[0].message));
    //check job
  const job = await Job.findById(req.query.jobId);
  if (!job) return next(new Error("Job not found!", { cause: 404 }));
  //check owner of thit job
  if (req.user._id.toString() != job.addedBy.toString())
    return next(
      new Error("You are not the owner of this job!", { cause: 404 })
    );
    //go to next middleware
    return next();
  });
  