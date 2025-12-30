/**
 * Logging utility
 * Provides consistent logging across the application
 */

const LogLevel = {
    ERROR: "ERROR",
    WARN: "WARN",
    INFO: "INFO",
    DEBUG: "DEBUG",
};

class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === "development";
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...meta,
        };

        return JSON.stringify(logEntry);
    }

    log(level, message, meta = {}) {
        const formattedMessage = this.formatMessage(level, message, meta);

        switch (level) {
            case LogLevel.ERROR:
                console.error(formattedMessage);
                break;
            case LogLevel.WARN:
                console.warn(formattedMessage);
                break;
            case LogLevel.INFO:
                console.info(formattedMessage);
                break;
            case LogLevel.DEBUG:
                if (this.isDevelopment) {
                    console.debug(formattedMessage);
                }
                break;
            default:
                console.log(formattedMessage);
        }
    }

    error(message, error = null, meta = {}) {
        this.log(LogLevel.ERROR, message, {
            ...meta,
            ...(error && {
                error: {
                    message: error.message,
                    stack: error.stack,
                },
            }),
        });
    }

    warn(message, meta = {}) {
        this.log(LogLevel.WARN, message, meta);
    }

    info(message, meta = {}) {
        this.log(LogLevel.INFO, message, meta);
    }

    debug(message, meta = {}) {
        this.log(LogLevel.DEBUG, message, meta);
    }
}

export const logger = new Logger();
