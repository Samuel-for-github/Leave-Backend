import prisma from "./prisma.js";

export const Leave = {
    submitLeave: (data)=> prisma.leave.create({data}),
    findByEmail: (email)=> prisma.leave.findMany({
        where: {email},
        orderBy: {createdAt: 'desc'}
    })
}