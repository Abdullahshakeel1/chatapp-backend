import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const isAuthenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
 
        if (!token) {
            return next(errorHandler(401, "Not authorized"));
        }

        jwt.verify(token, process.env.JWT_KEY, (err, user) => {  // Correct the env var name
            if (err) {
                return next(errorHandler(403, "Forbidden"));
            }

            // Ensure the user has an _id property
            if (!user._id) {
                return next(errorHandler(500, "Invalid token: user ID not found"));
            }

            // Attach user to request object
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
};
