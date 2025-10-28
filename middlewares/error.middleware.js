import { ApiError } from "../utils/ApiError.js";
import pkg from "../generated/prisma/index.js";
const {PrismaClientKnownRequestError} = pkg;
export const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Handle Prisma unique constraint error
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
        return res.status(400).json(
            new ApiError(
                400,
                `Unique constraint failed on fields: ${err.meta?.target?.join(", ")}`
            )
        );
    }

    // Custom ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode || 500).json(err);
    }

    // Fallback for unknown errors
    return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
};
