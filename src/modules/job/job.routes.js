import { Router } from "express";
import asyncHandler from "express-async-handler";
import * as jobController from "./job.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import {
  addJobSchema,
  applyToJobSchema,
  deleteJobSchema,
  getAllJobsForASpecificCompanySchema,
  getAllJobsThatMatchSchema,
  updateJobSchema,
} from "./job.validationSchemas.js";
import { jobOwnerVerification } from "../../middlewares/jobOwner.middleware.js";
import { fileValidation, uploadFileCould } from "../../utils/multerCouldinary.js";


const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(addJobSchema),
  asyncHandler(jobController.addJob)
);

router.put(
  "/",
  isAuthenticated,
  isAuthorized("Company_HR"),
  jobOwnerVerification,
  validation(updateJobSchema),
  asyncHandler(jobController.updateJob)
);

router.delete(
  "/",
  isAuthenticated,
  isAuthorized("Company_HR"),
  jobOwnerVerification,
  validation(deleteJobSchema),
  asyncHandler(jobController.deleteJob)
);

router.get(
  "/allJobs",
  isAuthenticated,
  asyncHandler(jobController.getAllJobsWithTheirCompany)
);

router.get(
  "/",
  isAuthenticated,
  validation(getAllJobsForASpecificCompanySchema),
  asyncHandler(jobController.getAllJobsForASpecificCompany)
);

router.get(
  "/search",
  isAuthenticated,
  validation(getAllJobsThatMatchSchema),
  asyncHandler(jobController.getAllJobsThatMatch)
);

router.post(
  "/applyToJob",
  isAuthenticated,
  isAuthorized("User"),
  uploadFileCould({ filter: fileValidation.pdf }).single("userResume"),
  validation(applyToJobSchema),
  asyncHandler(jobController.applyToJob)
);

export default router;
