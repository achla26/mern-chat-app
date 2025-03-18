import { validationResult } from "express-validator";
import {ApiError} from "./ApiError.js";

/**
 * Utility function to handle validation errors.
 * @param {object} req - The request object.
 * @throws {ApiError} - Throws an ApiError if validation fails.
 */
const ErrorValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new ApiError(400, "Validation failed", errorMessages);
    }
};

export default ErrorValidation;