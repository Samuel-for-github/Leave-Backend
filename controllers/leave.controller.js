import {Leave} from "../models/leave.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";

const getLeavesByDepartment = asyncHandler(async (req, res) => {
    const { department } = req.params;
    console.log(department)
    if (!department) {
        throw new ApiError(400, "Department is required");
    }

    const leaves = await Leave.findLeavesByDepartment(department);
    console.log(leaves);
    return res.status(200).json(
        new ApiResponse(200, leaves, "Leaves fetched successfully")
    );
});
const updateLeaveStatus = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;
    console.log(requestId, status)
    if (!requestId || !status) {
        throw new ApiError(400, "Request ID and status are required");
    }

    const updatedLeave = await Leave.updateLeaveStatus(requestId, status);

    if (!updatedLeave) {
        throw new ApiError(404, "Leave request not found");
    }

    return res.status(200).json(
        new ApiResponse(200, requestId, "Leave status updated successfully")
    );
});
export { getLeavesByDepartment, updateLeaveStatus };