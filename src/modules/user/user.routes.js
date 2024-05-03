import { Router } from "express";
import asyncHandler from "express-async-handler";

import * as userController from "./user.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import {
  changePasswordSchema,
  forgetPasswordSchema,
  getDataForAnotherUserSchema,
  getDataForSpecificRecoveryEmailSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  updateUserSchema,
} from "./user.validationSchemas.js";
import { conflict } from "../../middlewares/conflict.middleware.js";
import { userOwnerwnerVerification } from "../../middlewares/userOwner.middleware.js";

const router = Router();

router.post(
  "/",
  validation(signupSchema),
  conflict,
  asyncHandler(userController.signup)
);

router.post(
  "/login",
  validation(loginSchema),
  asyncHandler(userController.signin)
);

router.put(
  "/updateUser",
  isAuthenticated,
  userOwnerwnerVerification,
  conflict,
  validation(updateUserSchema),
  asyncHandler(userController.updateUser)
);

router.delete(
  "/",
  isAuthenticated,
  userOwnerwnerVerification,
  asyncHandler(userController.deleteUser)
);

router.get(
  "/",
  isAuthenticated,
  userOwnerwnerVerification,
  asyncHandler(userController.getAccountData)
);

router.get(
  "/search/:userId",
  validation(getDataForAnotherUserSchema),
  asyncHandler(userController.dataForAnotherUser)
);

router.patch(
  "/changePassword",
  isAuthenticated,
  validation(changePasswordSchema),
  asyncHandler(userController.changePassword)
);

router.post(
  "/forgetPassword",
  validation(forgetPasswordSchema),
  asyncHandler(userController.forgetPassword)
);

router.post(
  "/resetPassword",
  validation(resetPasswordSchema),
  asyncHandler(userController.resetPassword)
);

router.get(
  "/specificRecoveryEmail",
  validation(getDataForSpecificRecoveryEmailSchema),
  asyncHandler(userController.allAccountsToSpecificRecoveryEmail)
);
export default router;
