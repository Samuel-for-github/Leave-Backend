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
    findAll: ()=> prisma.user.findMany(),
    findByRole: (role)=> prisma.user.findMany({where: {role}}),
    updateUser: (id, data)=> prisma.user.update({where: {id}, data}),
    deleteUser: (id)=> prisma.user.delete({where: {id}}),
}