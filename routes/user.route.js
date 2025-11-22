import express from "express";
const router = express.Router();
import {
    register,
    getUserById,
    getUsersByRole,
    getUserByEmail,
    login,
    applyLeave,
    leaveHistory,
    updateUserLeaveBalance, getUsersByDepartment
} from "../controllers/user.controller.js";

router.post("/register", register);
router.post('/login', login);
router.get("/:id", getUserById);
router.post("/role", getUsersByRole);

router.post("/leave/apply", applyLeave);
router.get("/leave/history/:email", leaveHistory)
router.post("/email", getUserByEmail);
router.get("/department/:department", getUsersByDepartment);
router.patch("/:email/leave-balance", updateUserLeaveBalance);

export default router;