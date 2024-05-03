import { Router } from "express";
import asyncHandler from "express-async-handler";

import applicationsExcel from "./application.controller.js";

const router = Router();

router.get("/", asyncHandler(applicationsExcel));

export default router;
