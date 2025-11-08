import {Leave} from "../models/leave.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {sendMailForLeave} from "../utils/mail.js";

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
const getLeavesAcceptedByHOD = asyncHandler(async (req, res) => {



    const leaves = await Leave.findLeavesByHOD();
    console.log(leaves);
    return res.status(200).json(
        new ApiResponse(200, leaves, "Leaves fetched successfully")
    );
});

const updateLeaveStatus = asyncHandler(async (req, res) => {
    const { requestId, email } = req.params;
    const { status } = req.body;

    console.log(requestId, email,status)
    if (!requestId || !status) {
        throw new ApiError(400, "Request ID and status are required");
    }

    const updatedLeave = await Leave.updateLeaveStatus(requestId, status);
    // console.log(updatedLeave);
    if (!updatedLeave) {
        throw new ApiError(404, "Leave request not found");

    }
    if (updatedLeave.status === 'ACCEPTED') {
 await sendMailForLeave(email, updatedLeave);
    }


    return res.status(200).json(
        new ApiResponse(200, requestId, "Leave status updated successfully")
    );
});

const getLeavesHistory = asyncHandler(async(req, res)=>{
     const { userId, status, fromDate, toDate, department } = req.query;
console.log(userId, status, fromDate, toDate);

    // Build dynamic filters
    const filters = {};

    if (userId) filters.email = userId;
    if (status) filters.status = status;
    if (department) {
        filters.department = department
    }
    if (fromDate && toDate) {
      filters.createdAt = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    }
    const leaveHistory = await Leave.findLeaves(filters)
    console.log("leave", leaveHistory);
    
     return res.status(200).json(
        new ApiResponse(200, leaveHistory, "Leaves fetched successfully")
    );

})
export { getLeavesByDepartment, updateLeaveStatus , getLeavesAcceptedByHOD, getLeavesHistory};