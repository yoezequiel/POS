/**
 * Request validation middleware
 * Validates request body against defined schemas
 */

import { validate } from "../utils/validators.js";
import { ValidationError } from "../utils/errorHandler.js";

/**
 * Creates a middleware to validate request body
 * @param {Object} schema - Validation schema
 */
export const validateBody = (schema) => {
    return (req, res, next) => {
        const { isValid, errors } = validate(req.body, schema);

        if (!isValid) {
            throw new ValidationError("Validation failed", errors);
        }

        next();
    };
};

/**
 * Creates a middleware to validate query parameters
 * @param {Object} schema - Validation schema
 */
export const validateQuery = (schema) => {
    return (req, res, next) => {
        const { isValid, errors } = validate(req.query, schema);

        if (!isValid) {
            throw new ValidationError("Invalid query parameters", errors);
        }

        next();
    };
};
