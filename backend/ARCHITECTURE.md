# Backend Architecture

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── index.js      # Central config
│   ├── constants/        # Application constants
│   │   └── index.js      # Enums, constants
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── businessController.js
│   │   ├── cashController.js
│   │   ├── customerController.js
│   │   ├── productController.js
│   │   ├── reportController.js
│   │   ├── saleController.js
│   │   └── stockController.js
│   ├── db/              # Database layer
│   │   ├── connection.js # DB connection
│   │   └── migrate.js   # Migrations
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # Authentication
│   │   ├── requestLogger.js
│   │   └── validateRequest.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   ├── businessRoutes.js
│   │   ├── cashRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── saleRoutes.js
│   │   └── stockRoutes.js
│   ├── utils/           # Utilities
│   │   ├── bcrypt.js    # Password hashing
│   │   ├── errorHandler.js # Error handling
│   │   ├── jwt.js       # JWT utilities
│   │   ├── logger.js    # Logging
│   │   └── validators.js # Input validation
│   └── server.js        # Application entry point
├── package.json
└── README.md
```

## Design Patterns

### 1. **MVC Pattern**

-   **Models**: Database schemas and queries
-   **Views**: JSON responses
-   **Controllers**: Business logic and orchestration

### 2. **Middleware Pattern**

-   Request logging
-   Authentication
-   Validation
-   Error handling

### 3. **Repository Pattern**

-   Database access abstracted through controllers
-   Single responsibility principle

### 4. **Dependency Injection**

-   Configuration injected via environment variables
-   Database connection managed centrally

## Key Architectural Decisions

### Authentication

-   **JWT with Refresh Tokens**: Secure, stateless authentication
-   **Access tokens**: Short-lived (15 minutes)
-   **Refresh tokens**: Long-lived (7 days), stored in database

### Multi-tenancy

-   **Row-level isolation**: `business_id` column in all tables
-   **Middleware validation**: Ensures users only access their businesses
-   **Scalable**: Supports unlimited businesses on same database

### Error Handling

-   **Centralized**: Global error handler middleware
-   **Typed errors**: Custom error classes for different scenarios
-   **Logging**: Comprehensive error logging

### Security

-   **Password hashing**: bcrypt with configurable salt rounds
-   **SQL injection prevention**: Parameterized queries
-   **CORS**: Configurable allowed origins
-   **Input validation**: Schema-based validation

### Database Design

-   **Relational model**: Normalized tables
-   **Foreign keys**: Referential integrity
-   **Indexes**: Optimized queries on frequently accessed columns
-   **Soft deletes**: `is_active` flags instead of hard deletes

## Code Quality Standards

### Naming Conventions

-   **Files**: camelCase (e.g., `authController.js`)
-   **Functions**: camelCase (e.g., `createUser`)
-   **Constants**: UPPER_SNAKE_CASE (e.g., `USER_ROLES`)
-   **Classes**: PascalCase (e.g., `AppError`)

### Code Style

-   **ES6+ modules**: Import/export syntax
-   **Async/await**: For asynchronous operations
-   **Arrow functions**: For callbacks and short functions
-   **Destructuring**: For cleaner object access
-   **Template literals**: For string interpolation

### Documentation

-   **JSDoc comments**: For public functions
-   **Inline comments**: For complex logic
-   **README files**: For each major module
-   **API documentation**: Complete endpoint documentation

### Testing Strategy (Future)

-   **Unit tests**: For utilities and validators
-   **Integration tests**: For API endpoints
-   **E2E tests**: For critical user flows
-   **Test coverage**: Minimum 80%

## Performance Considerations

### Database

-   **Connection pooling**: Managed by Turso client
-   **Indexed columns**: `business_id`, `sku`, `created_at`
-   **Pagination**: Limit results to prevent overload
-   **Query optimization**: Select only needed columns

### Caching Strategy (Future)

-   **Redis**: For session management
-   **In-memory cache**: For frequently accessed data
-   **CDN**: For static assets

### Rate Limiting (Future)

-   **Per-endpoint limits**: Prevent abuse
-   **IP-based throttling**: Security measure
-   **User-based limits**: Fair usage policy

## Scalability

### Horizontal Scaling

-   **Stateless architecture**: Can run multiple instances
-   **Load balancer ready**: No session affinity needed
-   **Database**: Turso handles scaling automatically

### Vertical Scaling

-   **Efficient queries**: Minimize database load
-   **Async operations**: Non-blocking I/O
-   **Resource optimization**: Minimal memory footprint

## Security Best Practices

1. **Environment variables**: Sensitive data never hardcoded
2. **Input sanitization**: All user inputs validated
3. **SQL injection prevention**: Parameterized queries only
4. **XSS prevention**: Output encoding
5. **CSRF protection**: Token-based (future enhancement)
6. **Rate limiting**: Prevent brute force (future)
7. **HTTPS only**: In production
8. **Security headers**: Helmet.js (future)

## Monitoring & Logging

### Logging Levels

-   **ERROR**: Critical failures
-   **WARN**: Warning conditions
-   **INFO**: General information
-   **DEBUG**: Detailed debugging (dev only)

### What to Log

-   All requests (in development)
-   Authentication events
-   Business transactions (sales, cash operations)
-   Errors and exceptions
-   Performance metrics (response times)

### Future Enhancements

-   **APM**: Application Performance Monitoring
-   **Error tracking**: Sentry or similar
-   **Analytics**: Business metrics dashboard
-   **Alerting**: Critical error notifications
