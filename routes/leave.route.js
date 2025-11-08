import express from "express";
const router = express.Router();
import {getLeavesByDepartment, updateLeaveStatus, getLeavesAcceptedByHOD, getLeavesHistory} from "../controllers/leave.controller.js";
// router.get('')
router.get("/department/:department", getLeavesByDepartment);
router.get("/", getLeavesAcceptedByHOD);
router.patch("/:requestId/:email", updateLeaveStatus)
router.get('/leave-history', getLeavesHistory)
export default router;