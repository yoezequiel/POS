const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api";

interface RequestOptions {
    method?: string;
    body?: any;
    requireAuth?: boolean;
}

async function request(endpoint: string, options: RequestOptions = {}) {
    const { method = "GET", body, requireAuth = true } = options;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
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
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401 && requireAuth) {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshResponse.ok) {
                    const { accessToken } = await refreshResponse.json();
                    localStorage.setItem("accessToken", accessToken);

                    // Retry original request
                    headers["Authorization"] = `Bearer ${accessToken}`;
                    const retryResponse = await fetch(
                        `${API_URL}${endpoint}`,
                        config
                    );
                    return handleResponse(retryResponse);
                }
            } catch (error) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        localStorage.clear();
        window.location.href = "/login";
    }

    return handleResponse(response);
}

async function handleResponse(response: Response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.error || "Request failed");
    }

    return data;
}

export const api = {
    // Auth
    login: (email: string, password: string) =>
        request("/auth/login", {
            method: "POST",
            body: { email, password },
            requireAuth: false,
        }),

    register: (full_name: string, email: string, password: string) =>
        request("/auth/register", {
            method: "POST",
            body: { full_name, email, password },
            requireAuth: false,
        }),

    logout: (refreshToken: string) =>
        request("/auth/logout", { method: "POST", body: { refreshToken } }),

    // Businesses
    getBusinesses: () => request("/businesses"),

    createBusiness: (data: any) =>
        request("/businesses", { method: "POST", body: data }),

    // Products
    getProducts: (businessId: string, search?: string) => {
        const params = new URLSearchParams({ business_id: businessId });
        if (search) params.append("search", search);
        return request(`/products?${params}`);
    },

    createProduct: (data: any) =>
        request("/products", { method: "POST", body: data }),

    updateProduct: (id: string, data: any) =>
        request(`/products/${id}`, { method: "PUT", body: data }),

    deleteProduct: (id: string) =>
        request(`/products/${id}`, { method: "DELETE" }),

    // Categories
    getCategories: (businessId: string) =>
        request(`/products/categories?business_id=${businessId}`),

    createCategory: (data: any) =>
        request("/products/categories", { method: "POST", body: data }),

    // Sales
    getSales: (businessId: string, limit = 50) =>
        request(`/sales?business_id=${businessId}&limit=${limit}`),

    getSale: (id: string) => request(`/sales/${id}`),

    createSale: (data: any) =>
        request("/sales", { method: "POST", body: data }),

    cancelSale: (id: string) =>
        request(`/sales/${id}/cancel`, { method: "POST" }),

    // Cash
    openCash: (businessId: string, openingAmount: number) =>
        request("/cash/open", {
            method: "POST",
            body: { business_id: businessId, opening_amount: openingAmount },
        }),

    closeCash: (id: string, closingAmount: number) =>
        request(`/cash/${id}/close`, {
            method: "POST",
            body: { closing_amount: closingAmount },
        }),

    getCurrentCash: (businessId: string) =>
        request(`/cash/current?business_id=${businessId}`),

    // Customers
    getCustomers: (businessId: string, search?: string) => {
        const params = new URLSearchParams({ business_id: businessId });
        if (search) params.append("search", search);
        return request(`/customers?${params}`);
    },

    createCustomer: (data: any) =>
        request("/customers", { method: "POST", body: data }),

    updateCustomer: (id: string, data: any) =>
        request(`/customers/${id}`, { method: "PUT", body: data }),

    deleteCustomer: (id: string) =>
        request(`/customers/${id}`, { method: "DELETE" }),

    // Reports
    getDashboardStats: (businessId: string) =>
        request(`/reports/dashboard?business_id=${businessId}`),

    getSalesReport: (
        businessId: string,
        startDate?: string,
        endDate?: string
    ) => {
        const params = new URLSearchParams({ business_id: businessId });
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);
        return request(`/reports/sales?${params}`);
    },

    getTopProducts: (businessId: string) =>
        request(`/reports/top-products?business_id=${businessId}`),

    // Stock
    adjustStock: (data: any) =>
        request("/stock/adjust", { method: "POST", body: data }),

    getLowStock: (businessId: string) =>
        request(`/stock/low-stock?business_id=${businessId}`),
};
