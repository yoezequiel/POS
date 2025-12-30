# Testing Guide

## Test Examples for POS System

### Manual Testing with curl

#### Authentication

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Save the accessToken from response
TOKEN="your-access-token-here"
```

#### Business Management

```bash
# Create a business
curl -X POST http://localhost:3000/api/businesses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Mi Tienda",
    "address": "Calle Principal 123",
    "currency": "USD",
    "tax_rate": 0.21
  }'

# Get all businesses
curl http://localhost:3000/api/businesses \
  -H "Authorization: Bearer $TOKEN"

# Save business_id from response
BUSINESS_ID="your-business-id-here"
```

#### Product Management

```bash
# Create a category
curl -X POST http://localhost:3000/api/products/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "name": "Electrónicos"
  }'

CATEGORY_ID="your-category-id-here"

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "category_id": "'$CATEGORY_ID'",
    "name": "Laptop Dell",
    "sku": "LAP-001",
    "price": 599.99,
    "stock": 10,
    "is_active": true
  }'

PRODUCT_ID="your-product-id-here"

# Get all products
curl "http://localhost:3000/api/products?business_id=$BUSINESS_ID" \
  -H "Authorization: Bearer $TOKEN"

# Update product
curl -X PUT "http://localhost:3000/api/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "price": 549.99,
    "stock": 15
  }'
```

#### Customer Management

```bash
# Create a customer
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "name": "Juan Pérez",
    "document": "12345678",
    "email": "juan@example.com",
    "phone": "+1234567890"
  }'

CUSTOMER_ID="your-customer-id-here"

# Get all customers
curl "http://localhost:3000/api/customers?business_id=$BUSINESS_ID" \
  -H "Authorization: Bearer $TOKEN"
```

#### Cash Register

```bash
# Open cash register
curl -X POST http://localhost:3000/api/cash-register/open \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "opening_amount": 100
  }'

REGISTER_ID="your-register-id-here"

# Get current cash register
curl "http://localhost:3000/api/cash-register/current?business_id=$BUSINESS_ID" \
  -H "Authorization: Bearer $TOKEN"
```

#### Sales

```bash
# Create a sale
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "customer_id": "'$CUSTOMER_ID'",
    "cash_register_id": "'$REGISTER_ID'",
    "items": [
      {
        "product_id": "'$PRODUCT_ID'",
        "quantity": 2,
        "unit_price": 549.99
      }
    ],
    "discount": 10,
    "payment_method": "EFECTIVO"
  }'

SALE_ID="your-sale-id-here"

# Get all sales
curl "http://localhost:3000/api/sales?business_id=$BUSINESS_ID" \
  -H "Authorization: Bearer $TOKEN"

# Get sale details
curl "http://localhost:3000/api/sales/$SALE_ID" \
  -H "Authorization: Bearer $TOKEN"

# Cancel a sale
curl -X POST "http://localhost:3000/api/sales/$SALE_ID/cancel" \
  -H "Authorization: Bearer $TOKEN"
```

#### Stock Management

```bash
# Get stock movements
curl "http://localhost:3000/api/stock/movements?business_id=$BUSINESS_ID" \
  -H "Authorization: Bearer $TOKEN"

# Add stock adjustment
curl -X POST http://localhost:3000/api/stock/movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "product_id": "'$PRODUCT_ID'",
    "quantity": 5,
    "type": "IN",
    "reason": "Restock from supplier"
  }'
```

#### Reports

```bash
# Get dashboard stats
curl "http://localhost:3000/api/reports/dashboard?business_id=$BUSINESS_ID" \
  -H "Authorization: Bearer $TOKEN"

# Get top products
curl "http://localhost:3000/api/reports/top-products?business_id=$BUSINESS_ID&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

#### Close Cash Register

```bash
# Close cash register
curl -X POST http://localhost:3000/api/cash-register/close \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "closing_amount": 1200.50
  }'
```

---

## Unit Testing Setup (Future)

### Install Testing Dependencies

```bash
cd backend
npm install --save-dev jest @types/jest supertest @types/supertest
```

### Jest Configuration

Create `backend/jest.config.js`:

```javascript
module.exports = {
    testEnvironment: "node",
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/server.js",
        "!src/db/migrate.js",
    ],
    testMatch: ["**/__tests__/**/*.test.js"],
    verbose: true,
};
```

### Example Unit Tests

Create `backend/src/__tests__/validators.test.js`:

```javascript
const {
    validateEmail,
    validatePassword,
    validate,
} = require("../utils/validators");

describe("Validators", () => {
    describe("validateEmail", () => {
        test("validates correct email", () => {
            expect(validateEmail("user@example.com")).toBe(true);
        });

        test("rejects invalid email", () => {
            expect(validateEmail("invalid-email")).toBe(false);
            expect(validateEmail("")).toBe(false);
        });
    });

    describe("validatePassword", () => {
        test("accepts password with 6+ characters", () => {
            expect(validatePassword("password123")).toBe(true);
        });

        test("rejects short password", () => {
            expect(validatePassword("12345")).toBe(false);
        });
    });

    describe("validate", () => {
        const schema = {
            email: (v) => validateEmail(v) || "Invalid email",
            password: (v) => validatePassword(v) || "Password too short",
        };

        test("validates correct data", () => {
            const data = { email: "user@example.com", password: "pass123" };
            expect(() => validate(data, schema)).not.toThrow();
        });

        test("throws on invalid data", () => {
            const data = { email: "invalid", password: "123" };
            expect(() => validate(data, schema)).toThrow();
        });
    });
});
```

### Example Integration Tests

Create `backend/src/__tests__/auth.test.js`:

```javascript
const request = require("supertest");
const app = require("../server"); // Export app from server.js

describe("Authentication", () => {
    const testUser = {
        email: `test${Date.now()}@example.com`,
        password: "password123",
        full_name: "Test User",
    };

    test("POST /api/auth/register - creates new user", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send(testUser)
            .expect(201);

        expect(response.body).toHaveProperty("user");
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body.user.email).toBe(testUser.email);
    });

    test("POST /api/auth/login - logs in user", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password,
            })
            .expect(200);

        expect(response.body).toHaveProperty("accessToken");
    });

    test("POST /api/auth/login - rejects invalid credentials", async () => {
        await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: "wrongpassword",
            })
            .expect(401);
    });
});
```

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.js

# Watch mode
npm test -- --watch
```

---

## Load Testing with Apache Bench

```bash
# Install apache bench
sudo apt-get install apache2-utils  # Ubuntu/Debian
brew install httpd                   # macOS

# Test login endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 -p login.json -T application/json \
  http://localhost:3000/api/auth/login

# Create login.json
echo '{"email":"user@example.com","password":"password123"}' > login.json
```

---

## Postman Collection

Create a Postman collection with:

1. **Environment Variables**:

    - `base_url`: http://localhost:3000/api
    - `token`: {{accessToken}}
    - `business_id`: {{businessId}}

2. **Pre-request Script** (for authenticated requests):

```javascript
pm.request.headers.add({
    key: "Authorization",
    value: "Bearer " + pm.environment.get("token"),
});
```

3. **Test Script** (save tokens after login):

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.accessToken) {
        pm.environment.set("token", response.accessToken);
    }
}
```

---

## Database Testing

```bash
# Check database integrity
sqlite3 pos.db "PRAGMA integrity_check;"

# View table structure
sqlite3 pos.db ".schema users"

# Count records
sqlite3 pos.db "SELECT COUNT(*) FROM sales;"

# Check for orphaned records
sqlite3 pos.db "
  SELECT s.id
  FROM sales s
  LEFT JOIN businesses b ON s.business_id = b.id
  WHERE b.id IS NULL;
"
```

---

## Performance Monitoring

### Response Time Logging

The `requestLogger` middleware already logs response times:

```javascript
// Check logs for slow requests
grep "ms" logs/*.log | awk '$NF > 1000'
```

### Database Query Analysis

```javascript
// Add to connection.js for query logging
db.on("trace", (sql) => {
    console.log("[SQL]", sql);
});
```

---

## Error Testing Scenarios

### Test Error Handling

```bash
# 1. Test validation errors
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}'

# 2. Test authentication errors
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer invalid-token"

# 3. Test not found errors
curl "http://localhost:3000/api/products/non-existent-id" \
  -H "Authorization: Bearer $TOKEN"

# 4. Test duplicate entry
# Try creating the same business twice

# 5. Test insufficient stock
# Try selling more quantity than available
```

---

## Test Coverage Goals

-   **Unit Tests**: 80%+ coverage
-   **Integration Tests**: All API endpoints
-   **E2E Tests**: Critical user flows
-   **Performance Tests**: < 200ms response time
-   **Security Tests**: Authentication, authorization, input validation

---

## Continuous Integration (Future)

Example GitHub Actions workflow:

```yaml
name: Test

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v2

            - name: Setup Node.js
              uses: actions/setup-node@v2
              with:
                  node-version: "18"

            - name: Install dependencies
              run: cd backend && npm ci

            - name: Run tests
              run: cd backend && npm test

            - name: Upload coverage
              uses: codecov/codecov-action@v2
```
