/**
 * Type-safe API client for POS backend
 */

import type {
    AuthResponse,
    Business,
    Product,
    Category,
    Customer,
    Sale,
    CreateSaleRequest,
    CashRegister,
    DashboardStats,
    TopProduct,
    StockMovement,
} from "../types";

const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api";

interface RequestOptions extends RequestInit {
    requireAuth?: boolean;
}

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

/**
 * Make a request to the API with automatic token refresh
 */
async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const {
        method = "GET",
        body,
        requireAuth = true,
        ...fetchOptions
    } = options;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
    };

    if (requireAuth) {
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const config: RequestInit = {
        method,
        headers,
        ...fetchOptions,
    };

    if (body) {
        config.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    try {
        let response = await fetch(`${API_URL}${endpoint}`, config);

        // Handle token refresh on 401
        if (response.status === 401 && requireAuth) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const refreshResponse = await fetch(
                        `${API_URL}/auth/refresh`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ refreshToken }),
                        }
                    );

                    if (refreshResponse.ok) {
                        const { accessToken } = await refreshResponse.json();
                        localStorage.setItem("accessToken", accessToken);

                        // Retry original request with new token
                        headers["Authorization"] = `Bearer ${accessToken}`;
                        response = await fetch(`${API_URL}${endpoint}`, {
                            ...config,
                            headers,
                        });
                    } else {
                        // Refresh failed, redirect to login
                        localStorage.clear();
                        window.location.href = "/login";
                        throw new ApiError(401, "Session expired");
                    }
                } catch (error) {
                    localStorage.clear();
                    window.location.href = "/login";
                    throw new ApiError(401, "Session expired");
                }
            }
        }

        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({ error: "Unknown error" }));
            throw new ApiError(
                response.status,
                error.error || response.statusText
            );
        }

        return response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            0,
            error instanceof Error ? error.message : "Network error"
        );
    }
}

/**
 * Type-safe API client
 */
export const api = {
    // ========== Auth ==========

    login(email: string, password: string): Promise<AuthResponse> {
        return request<AuthResponse>("/auth/login", {
            method: "POST",
            body: { email, password },
            requireAuth: false,
        });
    },

    register(
        email: string,
        password: string,
        full_name: string
    ): Promise<AuthResponse> {
        return request<AuthResponse>("/auth/register", {
            method: "POST",
            body: { email, password, full_name },
            requireAuth: false,
        });
    },

    logout(): void {
        localStorage.clear();
        window.location.href = "/login";
    },

    // ========== Businesses ==========

    getBusinesses(): Promise<Business[]> {
        return request<Business[]>("/businesses");
    },

    createBusiness(data: Omit<Business, "id" | "role">): Promise<Business> {
        return request<Business>("/businesses", {
            method: "POST",
            body: data,
        });
    },

    updateBusiness(id: string, data: Partial<Business>): Promise<Business> {
        return request<Business>(`/businesses/${id}`, {
            method: "PUT",
            body: data,
        });
    },

    // ========== Products ==========

    getProducts(businessId: string): Promise<Product[]> {
        return request<Product[]>(`/products?business_id=${businessId}`);
    },

    getProduct(id: string): Promise<Product> {
        return request<Product>(`/products/${id}`);
    },

    createProduct(
        data: Omit<Product, "id" | "created_at" | "updated_at">
    ): Promise<Product> {
        return request<Product>("/products", {
            method: "POST",
            body: data,
        });
    },

    updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        return request<Product>(`/products/${id}`, {
            method: "PUT",
            body: data,
        });
    },

    deleteProduct(id: string): Promise<{ message: string }> {
        return request<{ message: string }>(`/products/${id}`, {
            method: "DELETE",
        });
    },

    // ========== Categories ==========

    getCategories(businessId: string): Promise<Category[]> {
        return request<Category[]>(
            `/products/categories?business_id=${businessId}`
        );
    },

    createCategory(
        data: Omit<Category, "id" | "created_at">
    ): Promise<Category> {
        return request<Category>("/products/categories", {
            method: "POST",
            body: data,
        });
    },

    deleteCategory(id: string): Promise<{ message: string }> {
        return request<{ message: string }>(`/products/categories/${id}`, {
            method: "DELETE",
        });
    },

    // ========== Customers ==========

    getCustomers(businessId: string): Promise<Customer[]> {
        return request<Customer[]>(`/customers?business_id=${businessId}`);
    },

    getCustomer(id: string): Promise<Customer> {
        return request<Customer>(`/customers/${id}`);
    },

    createCustomer(
        data: Omit<Customer, "id" | "created_at" | "updated_at">
    ): Promise<Customer> {
        return request<Customer>("/customers", {
            method: "POST",
            body: data,
        });
    },

    updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
        return request<Customer>(`/customers/${id}`, {
            method: "PUT",
            body: data,
        });
    },

    deleteCustomer(id: string): Promise<{ message: string }> {
        return request<{ message: string }>(`/customers/${id}`, {
            method: "DELETE",
        });
    },

    // ========== Sales ==========

    getSales(
        businessId: string,
        filters?: Record<string, string>
    ): Promise<Sale[]> {
        const params = new URLSearchParams({
            business_id: businessId,
            ...filters,
        });
        return request<Sale[]>(`/sales?${params}`);
    },

    getSale(id: string): Promise<Sale> {
        return request<Sale>(`/sales/${id}`);
    },

    createSale(data: CreateSaleRequest): Promise<Sale> {
        return request<Sale>("/sales", {
            method: "POST",
            body: data,
        });
    },

    cancelSale(id: string): Promise<Sale> {
        return request<Sale>(`/sales/${id}/cancel`, {
            method: "POST",
        });
    },

    // ========== Cash Register ==========

    openCashRegister(data: {
        business_id: string;
        opening_amount: number;
    }): Promise<CashRegister> {
        return request<CashRegister>("/cash-register/open", {
            method: "POST",
            body: data,
        });
    },

    closeCashRegister(data: {
        business_id: string;
        closing_amount: number;
    }): Promise<CashRegister> {
        return request<CashRegister>("/cash-register/close", {
            method: "POST",
            body: data,
        });
    },

    getCurrentCashRegister(businessId: string): Promise<CashRegister | null> {
        return request<CashRegister | null>(
            `/cash-register/current?business_id=${businessId}`
        );
    },

    getCashRegisterHistory(businessId: string): Promise<CashRegister[]> {
        return request<CashRegister[]>(
            `/cash-register/history?business_id=${businessId}`
        );
    },

    // ========== Reports ==========

    getDashboard(businessId: string): Promise<DashboardStats> {
        return request<DashboardStats>(
            `/reports/dashboard?business_id=${businessId}`
        );
    },

    getTopProducts(
        businessId: string,
        limit: number = 10
    ): Promise<TopProduct[]> {
        const params = new URLSearchParams({
            business_id: businessId,
            limit: limit.toString(),
        });
        return request<TopProduct[]>(`/reports/top-products?${params}`);
    },

    getSalesByPeriod(
        businessId: string,
        startDate: string,
        endDate: string
    ): Promise<Sale[]> {
        const params = new URLSearchParams({
            business_id: businessId,
            start_date: startDate,
            end_date: endDate,
        });
        return request<Sale[]>(`/reports/sales-by-period?${params}`);
    },

    // ========== Stock ==========

    getStockMovements(businessId: string): Promise<StockMovement[]> {
        return request<StockMovement[]>(
            `/stock/movements?business_id=${businessId}`
        );
    },

    addStockMovement(data: {
        business_id: string;
        product_id: string;
        quantity: number;
        type: "IN" | "OUT" | "ADJUSTMENT";
        reason?: string;
    }): Promise<StockMovement> {
        return request<StockMovement>("/stock/movements", {
            method: "POST",
            body: data,
        });
    },

    getLowStockProducts(
        businessId: string,
        threshold: number = 10
    ): Promise<Product[]> {
        const params = new URLSearchParams({
            business_id: businessId,
            threshold: threshold.toString(),
        });
        return request<Product[]>(`/stock/low-stock?${params}`);
    },
};

export { ApiError };
