import express from "express";
const router = express.Router();
import {getLeavesByDepartment, updateLeaveStatus, getLeavesAcceptedByHOD, getLeavesHistory, exportCSV} from "../controllers/leave.controller.js";
// router.get('')
router.get("/department/:department", getLeavesByDepartment);
router.get("/", getLeavesAcceptedByHOD);
router.patch("/:requestId/:email", updateLeaveStatus)
router.get('/leave-history', getLeavesHistory)
router.get("/history/export", exportCSV)
export default router;