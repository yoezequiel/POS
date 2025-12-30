/**
 * Input validation utilities
 * Centralizes validation logic for better maintainability
 */

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

export const validateRequired = (value) => {
    return value !== undefined && value !== null && value !== "";
};

export const validatePositiveNumber = (value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
};

export const validateEnum = (value, allowedValues) => {
    return allowedValues.includes(value);
};

// Validation schemas for different entities
export const schemas = {
    user: {
        email: (value) => validateRequired(value) && validateEmail(value),
        password: (value) => validateRequired(value) && validatePassword(value),
        full_name: (value) => validateRequired(value),
    },
    product: {
        name: (value) => validateRequired(value),
        price: (value) =>
            validateRequired(value) && validatePositiveNumber(value),
        stock: (value) => validatePositiveNumber(value),
    },
    sale: {
        items: (value) => Array.isArray(value) && value.length > 0,
        payment_method: (value) =>
            validateEnum(value, [
                "EFECTIVO",
                "DEBITO",
                "CREDITO",
                "TRANSFERENCIA",
            ]),
    },
};

/**
 * Validate object against schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validate = (data, schema) => {
    const errors = [];

    for (const [field, validator] of Object.entries(schema)) {
        if (!validator(data[field])) {
            errors.push(`Invalid ${field}`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
