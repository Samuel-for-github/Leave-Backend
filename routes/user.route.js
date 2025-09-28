import express from "express";
const router = express.Router();
import {register, getUserById,  getUsersByRole, getUserByEmail} from "../controllers/user.controller.js";

router.post("/register", register);

router.get("/:id", getUserById);
router.post("/role", getUsersByRole);


router.post("/email", getUserByEmail);

export default router;