import {Leave} from "../models/leave.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {sendMailForLeave} from "../utils/mail.js";
import { Parser } from "json2csv";
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
     const { userId, status,  department, leaveType, date } = req.query;

    console.log(date)
    // Build dynamic filters
    const filters = {};

    if (userId) filters.email = userId;
    if (status) filters.status = status;
    if (department) {
        filters.department = department
    }
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        filters.createdAt = {gte: start, lte: end};
        if (leaveType) {
            filters.leaveType = leaveType;
        }
    }
    const leaveHistory = await Leave.findLeaves(filters)
    console.log("leave", leaveHistory);
    
     return res.status(200).json(
        new ApiResponse(200, leaveHistory, "Leaves fetched successfully")
    );

})

const exportCSV = asyncHandler(async (req, res) => {
    // Implementation for exporting leave history as CSV
    console.log("Exporting CSV");
    const filters = {};
    const { userId, status,  department, leaveType, date } = req.query;


    if (userId) filters.email = userId;
    if (status) filters.status = status;
    if (department) {
        filters.department = department
    }
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        filters.createdAt = {gte: start, lte: end};
        if (leaveType) {
            filters.leaveType = leaveType;
        }
    }
    const leaveHistory = await Leave.findLeaves(filters);
    if (!leaveHistory.length) {
        return res.status(403).json({ message: "No data found for export" });
    }
    console.log("leave csv", leaveHistory);

    const uniqueFields = Array.from(
        new Set(leaveHistory.flatMap(item => Object.keys(item)))
    );

    const json2csv = new Parser({ fields: uniqueFields });
    const csv = json2csv.parse(leaveHistory);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=leave-history-${new Date().toISOString().split("T")[0]}.csv`
    );

    return res.status(200).end(csv);

});

export { getLeavesByDepartment, updateLeaveStatus , getLeavesAcceptedByHOD, getLeavesHistory, exportCSV};