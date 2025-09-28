import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    // Check hardcoded admin credentials
    const ADMIN_EMAIL = "adminofritgoa@ritgoa.com";
    const ADMIN_PASSWORD = "12345678";

    if (email !== ADMIN_EMAIL) {
        throw new ApiError(404, "Email not found");
    }
    if (password !== ADMIN_PASSWORD) {
        throw new ApiError(401, "Invalid password");
    }

    // Generate JWT Token
    const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // Set cookie
    res.cookie('admin_session', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,  // 1 day
        sameSite: 'strict'
    });

    res.status(200).json(new ApiResponse(200, { token }, "Admin login successful"));
});

const dashboard = asyncHandler(async (req, res) => {
    res.json({
        email: req.admin.email,
        message: 'Welcome to the admin dashboard'
    });
})

const logout = asyncHandler(async (req, res) => {
    res.clearCookie('admin_session', { httpOnly: true, sameSite: 'strict' });
    res.json({ success: true, message: 'Logged out successfully' });
})

const getAllUsers = asyncHandler(async (req, res)=>{
    const users = await User.findAll();
    res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
})
const acceptUser = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    console.log(id);
    const user = await User.findById(id);
    if(!user){
        throw new ApiError(404, "User not found");
    }
    await User.updateUser(id, {status: 'ACCEPTED'});
    res.status(200).json(new ApiResponse(200, null, "User accepted successfully"));
})

const rejectUser = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        throw new ApiError(404, "User not found");
    }
    await User.updateUser(id, {status: 'REJECTED'});
    res.status(200).json(new ApiResponse(200, null, "User accepted successfully"));
})


export { login, dashboard , logout, getAllUsers, acceptUser, rejectUser};
