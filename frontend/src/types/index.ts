/**
 * Type definitions for the POS application
 */

// User types
export interface User {
    id: string;
    email: string;
    full_name: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// Business types
export interface Business {
    id: string;
    name: string;
    address?: string;
    currency: string;
    tax_rate: number;
    role: "ADMIN" | "EMPLEADO";
}

// Product types
export interface Product {
    id: string;
    business_id: string;
    category_id?: string;
    category_name?: string;
    name: string;
    sku?: string;
    price: number;
    stock: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: string;
    business_id: string;
    name: string;
    created_at: string;
}

// Customer types
export interface Customer {
    id: string;
    business_id: string;
    name: string;
    document?: string;
    email?: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}

// Sale types
export type PaymentMethod = "EFECTIVO" | "DEBITO" | "CREDITO" | "TRANSFERENCIA";
export type SaleStatus = "COMPLETED" | "CANCELLED" | "PENDING";

export interface SaleItem {
    id?: string;
    product_id: string;
    product_name?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface Sale {
    id: string;
    business_id: string;
    user_id: string;
    user_name?: string;
    customer_id?: string;
    customer_name?: string;
    cash_register_id?: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    payment_method: PaymentMethod;
    status: SaleStatus;
    created_at: string;
    items?: SaleItem[];
}

export interface CreateSaleRequest {
    business_id: string;
    customer_id?: string;
    items: Array<{
        product_id: string;
        quantity: number;
        unit_price: number;
    }>;
    discount?: number;
    payment_method: PaymentMethod;
    cash_register_id?: string;
}

// Cash register types
export interface CashRegister {
    id: string;
    business_id: string;
    user_id: string;
    user_name?: string;
    opening_amount: number;
    closing_amount?: number;
    expected_amount?: number;
    opened_at: string;
    closed_at?: string;
    status: "OPEN" | "CLOSED";
}

// Report types
export interface DashboardStats {
    today: {
        sales_count: number;
        total: number;
    };
    month: {
        sales_count: number;
        total: number;
    };
    low_stock_count: number;
    active_products_count: number;
}

export interface TopProduct {
    id: string;
    name: string;
    sku?: string;
    total_quantity: number;
    total_revenue: number;
    sales_count: number;
}

export interface StockMovement {
    id: string;
    business_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    type: "IN" | "OUT" | "ADJUSTMENT";
    reason?: string;
    user_id: string;
    user_name: string;
    created_at: string;
}

// API Error types
export interface ApiError {
    error: string;
    errors?: string[];
}

// Form types
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    email: string;
    password: string;
    full_name: string;
}

export interface ProductForm {
    business_id: string;
    name: string;
    sku?: string;
    price: number;
    stock?: number;
    category_id?: string;
    is_active?: boolean;
}

export interface CustomerForm {
    business_id: string;
    name: string;
    document?: string;
    email?: string;
    phone?: string;
}
