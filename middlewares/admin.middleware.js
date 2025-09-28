import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const protectAdmin = (req, res, next) => {

    const token = req.cookies.admin_session;

    if (!token) {
        throw new ApiError(401, 'Not authenticated');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        throw new ApiError(401, 'Invalid token');
    }
};
