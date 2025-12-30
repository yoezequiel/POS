/**
 * Utility functions for formatting and validation
 */

/**
 * Format currency value
 */
export const formatCurrency = (
    value: number,
    currency: string = "USD"
): string => {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: currency,
    }).format(value);
};

/**
 * Format date
 */
export const formatDate = (
    date: string | Date,
    includeTime: boolean = false
): string => {
    const d = typeof date === "string" ? new Date(date) : date;

    if (includeTime) {
        return new Intl.DateTimeFormat("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(d);
    }

    return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(d);
};

/**
 * Truncate text to specified length
 */
export const truncate = (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Local storage helpers with error handling
 */
export const storage = {
    get: <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage:`, error);
            return null;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage:`, error);
        }
    },

    remove: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage:`, error);
        }
    },

    clear: (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error(`Error clearing localStorage:`, error);
        }
    },
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return (value / total) * 100;
};

/**
 * Generate random ID (for temporary use)
 */
export const generateTempId = (): string => {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if value is empty
 */
export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
};

/**
 * Group array by key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
        const group = String(item[key]);
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {} as Record<string, T[]>);
};

/**
 * Sort array by key
 */
export const sortBy = <T>(
    array: T[],
    key: keyof T,
    order: "asc" | "desc" = "asc"
): T[] => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return order === "asc" ? -1 : 1;
        if (aVal > bVal) return order === "asc" ? 1 : -1;
        return 0;
    });
};

/**
 * Sleep function for async operations
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error("Failed to copy:", error);
        return false;
    }
};
