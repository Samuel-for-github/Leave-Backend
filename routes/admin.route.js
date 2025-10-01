import express from "express";
const router = express.Router();
import {login, dashboard, logout, getAllUsers, acceptUser, rejectUser, stats} from "../controllers/admin.controller.js";
import {protectAdmin} from "../middlewares/admin.middleware.js";


router.post("/login",login);
router.get('/dashboard', protectAdmin, dashboard);
///admin
router.get('/stats', protectAdmin, stats);
router.get('/users/all', protectAdmin, getAllUsers);
router.put('/users/:id/accept', protectAdmin, acceptUser);
router.put('/users/:id/reject', protectAdmin, rejectUser);
router.post('/logout', protectAdmin, logout)
export default router;