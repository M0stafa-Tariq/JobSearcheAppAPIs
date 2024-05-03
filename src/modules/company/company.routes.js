import { Router } from "express";
import asyncHandler from "express-async-handler";

import * as companyController from "./company.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import {
  addCompanySchema,
  getCompanyDataSchema,
  searchCompanySchema,
  updateCompanySchema,
} from "./company.validationSchemas.js";
import { companyOwnerVerification } from "../../middlewares/companyOwner.middleware.js";
import { jobOwnerVerification } from "../../middlewares/jobOwner.middleware.js";
const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(addCompanySchema),
  asyncHandler(companyController.addCompany)
);

router.put(
  "/",
  isAuthenticated,
  isAuthorized("Company_HR"),
  companyOwnerVerification,
  validation(updateCompanySchema),
  asyncHandler(companyController.updateCompany)
);

router.delete(
  "/",
  isAuthenticated,
  isAuthorized("Company_HR"),
  companyOwnerVerification,
  asyncHandler(companyController.deleteCompany)
);

router.get(
  "/getData/:companyId",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(getCompanyDataSchema),
  asyncHandler(companyController.getCompanyData)
);

router.get(
  "/findCompany",
  isAuthenticated,
  validation(searchCompanySchema),
  asyncHandler(companyController.searchCompanyWithName)
);

router.get(
  "/specificJob",
  isAuthenticated,
  isAuthorized("Company_HR"),
  jobOwnerVerification,
  asyncHandler(companyController.getAllApplicationsForSpecificJobs)
);

export default router;
