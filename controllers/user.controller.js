import {User} from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import { validate as isUuid } from 'uuid';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../models/prisma.js";
import { Leave } from "../models/leave.model.js";
export const register = asyncHandler(async (req, res) => {
    const { email, username, role, department, mobile } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    // Validation
    if (!email || !username) {
        throw new ApiError(400, "Email and username are required");
    }


    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    //create a password
    // const password = username+"@123";
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Create user with hashed password
    const newUser = await User.insert({
        email: lowerCaseEmail,
        username,
        role,
        department,
        mobile,


    });

    // Remove password from response
    const userResponse = { ...newUser };
    delete userResponse.password;

    return res.status(201).json(
        new ApiResponse(201, userResponse, "User registered successfully")
    );
});
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    // Validation
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // Find user
    console.log(email, password)
    const user = await User.findByEmail(lowerCaseEmail)

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
        {
            userId: user.id,
            email: lowerCaseEmail,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json(
        new ApiResponse(200, {
            success: true,
            user: userWithoutPassword,
            token
        }, "Login successful")
    );
});
export const getUserByEmail = asyncHandler(async (req, res)=>{
    const {email} = req.body;
    console.log(email)
    if(!email){
        throw new ApiError(400, "Email is required");
    }
    const user = await User.findByEmail(email);
    console.log(user)
    if(!user){
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
})

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isUuid(id)) {
        throw new ApiError(400, "Invalid UUID format");
    }

    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});
export const getUsersByRole = asyncHandler(async (req, res)=>{
    const {role} = req.body;
    const users = await User.findByRole(role);
    res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
})
export const updateUser = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const {email, username, role} = req.body;

})


export const applyLeave = asyncHandler(async(req, res)=>{
    const { email, leaveType, startDate, endDate, reason, department } = req.body;
    const newLeave = {
        email,
        department,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        createdAt: new Date(),
      };
      const leave = await Leave.submitLeave(newLeave)
  console.log(newLeave)
      return res.status(201).json(
        new ApiResponse(201, leave, "Leave Submited succesfully")
      )
  
})

export const leaveHistory = asyncHandler(async(req, res)=>{

    const { email } = req.params;
    console.log("hist", email);
    
    const leaves = await Leave.findByEmail(email);

    res.json(leaves);
  
})
