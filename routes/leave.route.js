import express from "express";
const router = express.Router();
import {getLeavesByDepartment, updateLeaveStatus} from "../controllers/leave.controller.js";
// router.get('')
router.get("/department/:department", getLeavesByDepartment);
router.patch("/:requestId", updateLeaveStatus)
export default router;