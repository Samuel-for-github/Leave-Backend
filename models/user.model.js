import prisma from "./prisma.js";

export const User = {
    insert: (data)=> prisma.user.create({data}),
    findByEmail: (email) => prisma.user.findFirst({

        where: {
            email: {
                equals: email,
                mode: "insensitive"
            }

        }
    }),
    findById: (id)=> prisma.user.findUnique({where: {id: String(id)}}),
  findAll: () => prisma.user.findMany(),
    findByRole: (role)=> prisma.user.findMany({where: {role}}),
    findByEmailUpdate: async (email, data) => {

        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase(),
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Calculate new balance
        const currentBalance = user[data.leaveType];
        const newBalance = currentBalance - data.days;

        if (newBalance < 0) {
            throw new Error(
                `Insufficient balance. Available: ${currentBalance}, Requested: ${data.days}`
            );
        }

        // Update user
        return await prisma.user.update({
            where: {
                email: email.toLowerCase(),
            },
            data: {
                [data.leaveType]: newBalance,
                leave_balance: user.leave_balance - data.days,
                updatedAt: new Date(),
            },
        });

    },
    updateUser: (id, data)=> prisma.user.update({where: {id}, data}),
    deleteUser: (id)=> prisma.user.delete({where: {id}}),
}