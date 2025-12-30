# Frontend Best Practices

## Project Structure

```
frontend/src/
├── components/       # Reusable React components (future)
├── layouts/         # Astro layouts
├── lib/            # Utilities and API client
├── pages/          # Astro pages (routes)
├── styles/         # Global styles
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
```

## Code Organization

### Component Structure (React)

```typescript
// 1. Imports
import { useState, useEffect } from "react";
import type { Props } from "../types";

// 2. Types/Interfaces
interface ComponentProps {
    // ...
}

// 3. Component
export function Component({ prop1, prop2 }: ComponentProps) {
    // 4. Hooks
    const [state, setState] = useState();

    useEffect(() => {
        // ...
    }, []);

    // 5. Event handlers
    const handleClick = () => {
        // ...
    };

    // 6. Render
    return <div>{/* JSX */}</div>;
}
```

### Page Structure (Astro)

```astro
---
// 1. Imports
import Layout from '../layouts/Layout.astro';

// 2. Server-side logic
const data = await fetchData();
---

<!-- 3. Template -->
<Layout title="Page">
  <!-- HTML -->
</Layout>

<!-- 4. Styles -->
<style>
  /* Scoped styles */
</style>

<!-- 5. Client-side scripts -->
<script>
  // Client-side JavaScript
</script>
```

## TypeScript Best Practices

### Always Define Types

```typescript
// ❌ Bad
const user = JSON.parse(localStorage.getItem("user"));

// ✅ Good
import type { User } from "./types";
const user: User | null = storage.get<User>("user");
```

### Use Type Guards

```typescript
function isProduct(obj: any): obj is Product {
    return obj && typeof obj.id === "string" && typeof obj.price === "number";
}
```

### Avoid `any`

```typescript
// ❌ Bad
const data: any = await response.json();

// ✅ Good
const data: ApiResponse = await response.json();
```

## State Management

### Local Storage

```typescript
import { storage } from "../utils/helpers";

// Get
const user = storage.get<User>("user");

// Set
storage.set("user", userData);

// Remove
storage.remove("user");
```

### Component State

-   Use `useState` for local component state
-   Keep state as close to where it's used as possible
-   Lift state up only when necessary

## API Communication

### Error Handling

```typescript
try {
    const data = await api.getProducts(businessId);
    // Handle success
} catch (error) {
    if (error instanceof Error) {
        console.error(error.message);
        // Show user-friendly error
    }
}
```

### Loading States

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
    setLoading(true);
    try {
        const data = await api.getData();
        // Process data
    } catch (error) {
        // Handle error
    } finally {
        setLoading(false);
    }
};
```

## Performance Optimization

### Debouncing Search

```typescript
import { debounce } from "../utils/helpers";

const debouncedSearch = debounce((query: string) => {
    performSearch(query);
}, 300);
```

### Lazy Loading

```astro
---
// Only load heavy components when needed
const HeavyComponent = import('./HeavyComponent');
---
```

### Memoization (React)

```typescript
import { useMemo, useCallback } from "react";

// Expensive calculation
const computedValue = useMemo(() => {
    return expensiveCalculation(data);
}, [data]);

// Function memoization
const handleClick = useCallback(() => {
    // ...
}, [dependency]);
```

## Accessibility

### Semantic HTML

```html
<!-- ✅ Good -->
<button onClick="{handleClick}">Click me</button>
<nav>...</nav>
<main>...</main>

<!-- ❌ Bad -->
<div onClick="{handleClick}">Click me</div>
<div class="navigation">...</div>
```

### ARIA Labels

```html
<button aria-label="Close modal" onClick="{close}">×</button>

<input type="text" aria-label="Search products" placeholder="Search..." />
```

### Keyboard Navigation

-   Ensure all interactive elements are keyboard accessible
-   Use proper tab order
-   Implement keyboard shortcuts where appropriate

## Security

### XSS Prevention

```typescript
// ❌ Bad - Direct HTML injection
element.innerHTML = userInput;

// ✅ Good - Use framework's safe rendering
{
    userInput;
} // In React/Astro
```

### Validate User Input

```typescript
// Always validate before sending to API
if (!isValidEmail(email)) {
    showError("Invalid email format");
    return;
}
```

### Secure Storage

```typescript
// ❌ Bad - Storing sensitive data
localStorage.setItem("password", password);

// ✅ Good - Only store tokens, never passwords
localStorage.setItem("accessToken", token);
```

## Error Handling

### User-Friendly Messages

```typescript
const ERROR_MESSAGES = {
    NETWORK_ERROR: "No se pudo conectar. Verifica tu conexión.",
    VALIDATION_ERROR: "Por favor, completa todos los campos requeridos.",
    NOT_FOUND: "El recurso solicitado no existe.",
    SERVER_ERROR: "Ocurrió un error. Por favor, intenta de nuevo.",
};
```

### Try-Catch Blocks

```typescript
// Always wrap API calls
try {
    await api.createProduct(data);
    showSuccess("Producto creado exitosamente");
} catch (error) {
    const message =
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
    showError(message);
}
```

## Testing (Future Enhancement)

### Unit Tests

```typescript
describe("formatCurrency", () => {
    it("formats USD correctly", () => {
        expect(formatCurrency(100, "USD")).toBe("$100.00");
    });
});
```

### Integration Tests

```typescript
describe("Login Flow", () => {
    it("successfully logs in user", async () => {
        // Test implementation
    });
});
```

## Code Style

### Naming Conventions

-   **Components**: PascalCase (`ProductCard`)
-   **Functions**: camelCase (`formatCurrency`)
-   **Constants**: UPPER_SNAKE_CASE (`API_URL`)
-   **Files**: kebab-case (`product-card.tsx`)

### Formatting

-   Use Prettier for consistent formatting
-   2 spaces for indentation
-   Single quotes for strings
-   Semicolons always
-   Trailing commas in objects/arrays

### Comments

```typescript
/**
 * Calculates the total with tax and discount
 * @param subtotal - Initial amount
 * @param discount - Discount amount
 * @param taxRate - Tax rate as decimal (e.g., 0.21 for 21%)
 * @returns Final total amount
 */
function calculateTotal(
    subtotal: number,
    discount: number,
    taxRate: number
): number {
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * taxRate;
    return afterDiscount + tax;
}
```

## File Organization

### Import Order

```typescript
// 1. External libraries
import { useState } from "react";
import { v4 as uuid } from "uuid";

// 2. Internal utilities
import { api } from "../lib/api";
import { formatCurrency } from "../utils/helpers";

// 3. Types
import type { Product } from "../types";

// 4. Styles
import "./styles.css";
```

## Progressive Enhancement

-   Always provide fallbacks for JavaScript features
-   Ensure core functionality works without JavaScript
-   Use feature detection, not browser detection

## Documentation

-   Document complex functions with JSDoc
-   Add README files for major features
-   Keep inline comments minimal but meaningful
-   Document component props with TypeScript
