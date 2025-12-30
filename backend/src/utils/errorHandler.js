/**
 * Centralized error handling utilities
 * Provides consistent error responses across the API
 */

export class AppError extends Error {
    constructor(message, statusCode = 500, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400, errors);
    }
}

export class AuthenticationError extends AppError {
    constructor(message = "Authentication failed") {
        super(message, 401);
    }
}

export class AuthorizationError extends AppError {
    constructor(message = "Insufficient permissions") {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
        console.error("Error:", {
            message: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
        });
    } else {
        console.error("Error:", err.message);
    }

    // Handle operational errors
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            error: err.message,
            ...(err.errors.length > 0 && { errors: err.errors }),
        });
    }

    // Handle unexpected errors
    res.status(500).json({
        error: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { message: err.message }),
    });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
