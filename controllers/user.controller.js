import {User} from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import { validate as isUuid } from 'uuid';
export const register = asyncHandler(async (req, res)=>{
    const {email, username, role, department} = req.body;

    if(!email || !username){
        throw new ApiError(400, "Email and username are required");
    }

    const newUser = await User.insert({email, username, role, department});

   return res.status(201).json(new ApiResponse(201, newUser, "User registered successfully"));
})

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

