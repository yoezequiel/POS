/**
 * Application constants
 * Centralized location for all constant values
 */

export const USER_ROLES = {
    ADMIN: "ADMIN",
    EMPLEADO: "EMPLEADO",
};

export const PAYMENT_METHODS = {
    EFECTIVO: "EFECTIVO",
    DEBITO: "DEBITO",
    CREDITO: "CREDITO",
    TRANSFERENCIA: "TRANSFERENCIA",
};

export const SALE_STATUS = {
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    PENDING: "PENDING",
};

export const STOCK_MOVEMENT_TYPES = {
    IN: "IN",
    OUT: "OUT",
    ADJUSTMENT: "ADJUSTMENT",
};

export const CASH_REGISTER_STATUS = {
    OPEN: "OPEN",
    CLOSED: "CLOSED",
};

export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_TAX_RATE = 0;
export const SALT_ROUNDS = 10;

// JWT Configuration
export const TOKEN_EXPIRY = {
    ACCESS: "15m",
    REFRESH: "7d",
};

// Pagination
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

// Stock thresholds
export const LOW_STOCK_THRESHOLD = 10;

// Response messages
export const MESSAGES = {
    SUCCESS: {
        CREATED: "Resource created successfully",
        UPDATED: "Resource updated successfully",
        DELETED: "Resource deleted successfully",
    },
    ERROR: {
        REQUIRED_FIELDS: "All required fields must be provided",
        INVALID_CREDENTIALS: "Invalid email or password",
        EMAIL_EXISTS: "Email already registered",
        NOT_FOUND: "Resource not found",
        UNAUTHORIZED: "Unauthorized access",
        FORBIDDEN: "Insufficient permissions",
        INVALID_TOKEN: "Invalid or expired token",
    },
};
