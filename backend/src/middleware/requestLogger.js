/**
 * Request logging middleware
 * Logs all incoming requests for monitoring and debugging
 */

import { logger } from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log request
    logger.info("Incoming request", {
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
    });

    // Log response when finished
    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info("Request completed", {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });

    next();
};
