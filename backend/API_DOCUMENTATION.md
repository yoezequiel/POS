# API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Register User

**POST** `/auth/register`

Creates a new user account.

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe"
}
```

**Response:** `201 Created`

```json
{
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "full_name": "John Doe"
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_refresh_token"
}
```

**Errors:**

-   `400` - Validation error or email already exists
-   `500` - Server error

---

### Login

**POST** `/auth/login`

Authenticates a user and returns tokens.

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "securepassword"
}
```

**Response:** `200 OK`

```json
{
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "full_name": "John Doe"
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_refresh_token"
}
```

**Errors:**

-   `400` - Missing credentials
-   `401` - Invalid credentials
-   `500` - Server error

---

### Refresh Token

**POST** `/auth/refresh`

Generates a new access token using a refresh token.

**Request Body:**

```json
{
    "refreshToken": "jwt_refresh_token"
}
```

**Response:** `200 OK`

```json
{
    "accessToken": "new_jwt_token"
}
```

**Errors:**

-   `400` - Missing refresh token
-   `401` - Invalid or expired refresh token
-   `500` - Server error

---

### Logout

**POST** `/auth/logout`

Invalidates the refresh token.

**Request Body:**

```json
{
    "refreshToken": "jwt_refresh_token"
}
```

**Response:** `200 OK`

```json
{
    "message": "Logged out successfully"
}
```

---

## Businesses

### Create Business

**POST** `/businesses`
🔒 _Requires authentication_

Creates a new business for the authenticated user.

**Request Body:**

```json
{
    "name": "My Store",
    "address": "123 Main St",
    "currency": "USD",
    "tax_rate": 0.21
}
```

**Response:** `201 Created`

```json
{
    "id": "uuid",
    "name": "My Store",
    "address": "123 Main St",
    "currency": "USD",
    "tax_rate": 0.21,
    "role": "ADMIN"
}
```

---

### List Businesses

**GET** `/businesses`
🔒 _Requires authentication_

Returns all businesses accessible to the authenticated user.

**Response:** `200 OK`

```json
[
    {
        "id": "uuid",
        "name": "My Store",
        "address": "123 Main St",
        "currency": "USD",
        "tax_rate": 0.21,
        "role": "ADMIN"
    }
]
```

---

## Products

### List Products

**GET** `/products?business_id=uuid&search=query&is_active=true`
🔒 _Requires authentication_

Returns products for a business with optional filtering.

**Query Parameters:**

-   `business_id` (required) - Business UUID
-   `search` (optional) - Search by name or SKU
-   `is_active` (optional) - Filter by active status

**Response:** `200 OK`

```json
[
    {
        "id": "uuid",
        "business_id": "uuid",
        "name": "Product Name",
        "sku": "SKU123",
        "price": 19.99,
        "stock": 100,
        "category_id": "uuid",
        "category_name": "Category",
        "is_active": 1,
        "created_at": "2025-01-01T00:00:00.000Z"
    }
]
```

---

### Create Product

**POST** `/products`
🔒 _Requires authentication_

Creates a new product.

**Request Body:**

```json
{
    "business_id": "uuid",
    "name": "Product Name",
    "sku": "SKU123",
    "price": 19.99,
    "stock": 100,
    "category_id": "uuid",
    "is_active": 1
}
```

**Response:** `201 Created`

---

### Update Product

**PUT** `/products/:id`
🔒 _Requires authentication_

Updates an existing product.

**Request Body:** (all fields optional)

```json
{
    "name": "Updated Name",
    "price": 24.99,
    "stock": 150
}
```

**Response:** `200 OK`

---

## Sales

### Create Sale

**POST** `/sales`
🔒 _Requires authentication_

Registers a new sale.

**Request Body:**

```json
{
    "business_id": "uuid",
    "customer_id": "uuid",
    "items": [
        {
            "product_id": "uuid",
            "quantity": 2,
            "unit_price": 19.99
        }
    ],
    "discount": 5.0,
    "payment_method": "EFECTIVO",
    "cash_register_id": "uuid"
}
```

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "business_id": "uuid",
  "subtotal": 39.98,
  "discount": 5.00,
  "tax": 7.35,
  "total": 42.33,
  "payment_method": "EFECTIVO",
  "items": [...]
}
```

**Payment Methods:**

-   `EFECTIVO`
-   `DEBITO`
-   `CREDITO`
-   `TRANSFERENCIA`

---

## Cash Register

### Open Cash Register

**POST** `/cash/open`
🔒 _Requires authentication_

Opens a new cash register session.

**Request Body:**

```json
{
    "business_id": "uuid",
    "opening_amount": 100.0
}
```

**Response:** `201 Created`

---

### Close Cash Register

**POST** `/cash/:id/close`
🔒 _Requires authentication_

Closes a cash register and calculates the difference.

**Request Body:**

```json
{
    "closing_amount": 550.0
}
```

**Response:** `200 OK`

```json
{
    "id": "uuid",
    "opening_amount": 100.0,
    "closing_amount": 550.0,
    "expected_amount": 540.0,
    "difference": 10.0,
    "total_sales": 440.0,
    "cash_sales": 440.0,
    "sales_count": 15
}
```

---

## Reports

### Dashboard Stats

**GET** `/reports/dashboard?business_id=uuid`
🔒 _Requires authentication_

Returns key statistics for the dashboard.

**Response:** `200 OK`

```json
{
    "today": {
        "sales_count": 5,
        "total": 250.0
    },
    "month": {
        "sales_count": 120,
        "total": 5400.0
    },
    "low_stock_count": 3,
    "active_products_count": 45
}
```

---

### Top Products

**GET** `/reports/top-products?business_id=uuid&limit=10`
🔒 _Requires authentication_

Returns the best-selling products.

**Response:** `200 OK`

```json
[
    {
        "id": "uuid",
        "name": "Product Name",
        "sku": "SKU123",
        "total_quantity": 150,
        "total_revenue": 2998.5,
        "sales_count": 75
    }
]
```

---

## Error Responses

All endpoints may return the following error structure:

```json
{
    "error": "Error message",
    "errors": ["Detailed error 1", "Detailed error 2"]
}
```

**Common Status Codes:**

-   `400` - Bad Request (validation error)
-   `401` - Unauthorized (missing or invalid token)
-   `403` - Forbidden (insufficient permissions)
-   `404` - Not Found
-   `409` - Conflict (resource already exists)
-   `500` - Internal Server Error
