import prisma from "./prisma.js";

export const Leave = {
    submitLeave: (data)=> prisma.leave.create({data}),
    findByEmail: (email)=> prisma.leave.findMany({
        where: {email},
        orderBy: {createdAt: 'desc'}
    }),
    findLeavesByDepartment: (department) => prisma.leave.findMany({
        where: {department},
        orderBy: {createdAt: 'desc'}
    }),
    updateLeaveStatus: (requestId, status) => prisma.leave.update({
        where: {id: requestId},
        data: {status}
    })
}