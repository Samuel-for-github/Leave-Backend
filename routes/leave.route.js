import express from "express";
const router = express.Router();
import {getLeavesByDepartment, updateLeaveStatus, getLeavesAcceptedByHOD} from "../controllers/leave.controller.js";
// router.get('')
router.get("/department/:department", getLeavesByDepartment);
router.get("/", getLeavesAcceptedByHOD);
router.patch("/:requestId/:email", updateLeaveStatus)
export default router;