# Examples - Sistema POS

Ejemplos prácticos de uso del sistema POS.

## 📖 Tabla de Contenidos

1. [Inicio Rápido con Demo](#inicio-rápido-con-demo)
2. [Flujo Completo de Uso](#flujo-completo-de-uso)
3. [Casos de Uso Comunes](#casos-de-uso-comunes)
4. [Ejemplos de API](#ejemplos-de-api)
5. [Ejemplos de Frontend](#ejemplos-de-frontend)

---

## Inicio Rápido con Demo

### Opción 1: Usar Datos Precargados (Recomendado)

```bash
# En el directorio backend
cd backend

# Ejecutar migraciones
npm run migrate

# Poblar con datos realistas
npm run seed

# Iniciar servidor
npm run dev
```

**Credenciales de demo**:

-   Email: `demo@pos.com`
-   Password: `demo123`

**Datos incluidos**:

-   ✅ 1 negocio: "Tienda El Buen Precio"
-   ✅ 6 categorías de productos
-   ✅ 28 productos con precios realistas
-   ✅ 8 clientes
-   ✅ 8 ventas de ejemplo
-   ✅ Historial de caja cerrada
-   ✅ Movimientos de inventario

Ahora puedes ir directamente a `http://localhost:4321/login` y probar el sistema completo.

---

## Flujo Completo de Uso

### Escenario: Nueva tienda iniciando operaciones (sin seed)

#### 1. Registro de Usuario

**Frontend** (`/register`):

-   Navegar a la página de registro
-   Ingresar email, nombre completo y contraseña
-   Hacer clic en "Registrarse"

**API Request**:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@mitienda.com",
    "full_name": "María González",
    "password": "password123"
  }'
```

**Response**:

```json
{
    "user": {
        "id": "user-uuid",
        "email": "maria@mitienda.com",
        "full_name": "María González"
    },
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

#### 2. Crear Negocio

**Frontend** (`/businesses`):

-   Hacer clic en "Crear Negocio"
-   Completar formulario con datos del negocio
-   Seleccionar moneda y tasa de impuesto

**API Request**:

```bash
TOKEN="eyJhbGciOiJIUzI1..."

curl -X POST http://localhost:3000/api/businesses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Tienda Mi Rincón",
    "address": "Av. Principal 123, Ciudad",
    "currency": "USD",
    "tax_rate": 0.21
  }'
```

**Response**:

```json
{
    "id": "business-uuid",
    "name": "Tienda Mi Rincón",
    "address": "Av. Principal 123, Ciudad",
    "currency": "USD",
    "tax_rate": 0.21,
    "role": "ADMIN"
}
```

#### 3. Crear Categorías

**Frontend** (`/products`):

-   Click en pestaña "Categorías"
-   Click en "Nueva Categoría"
-   Ingresar nombre de categoría

**API Request**:

```bash
BUSINESS_ID="business-uuid"

curl -X POST http://localhost:3000/api/products/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "name": "Electrónicos"
  }'
```

#### 4. Agregar Productos

**Frontend** (`/products`):

-   Click en "Nuevo Producto"
-   Completar formulario (nombre, precio, stock, categoría, SKU)
-   Guardar

**API Request**:

```bash
CATEGORY_ID="category-uuid"

curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "category_id": "'$CATEGORY_ID'",
    "name": "Auriculares Bluetooth",
    "sku": "AUR-BT-001",
    "price": 45.99,
    "stock": 20,
    "is_active": true
  }'
```

#### 5. Abrir Caja

**Frontend** (`/pos` o `/dashboard`):

-   Hacer clic en "Abrir Caja"
-   Ingresar monto inicial en efectivo
-   Confirmar apertura

**API Request**:

```bash
curl -X POST http://localhost:3000/api/cash-register/open \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "opening_amount": 100.00
  }'
```

#### 6. Registrar Cliente (Opcional)

**Frontend** (`/customers`):

-   Click en "Nuevo Cliente"
-   Completar datos del cliente
-   Guardar

**API Request**:

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "name": "Carlos Rodríguez",
    "document": "12345678",
    "email": "carlos@example.com",
    "phone": "+1234567890"
  }'
```

#### 7. Realizar Venta

**Frontend** (`/pos`):

1. Buscar productos por nombre o SKU
2. Agregar al carrito con cantidad deseada
3. (Opcional) Seleccionar cliente
4. (Opcional) Aplicar descuento
5. Seleccionar método de pago
6. Confirmar venta

**API Request**:

```bash
PRODUCT_ID="product-uuid"
CUSTOMER_ID="customer-uuid"
REGISTER_ID="register-uuid"

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
        "unit_price": 45.99
      }
    ],
    "discount": 5.00,
    "payment_method": "EFECTIVO"
  }'
```

**Response**:

```json
{
    "id": "sale-uuid",
    "subtotal": 91.98,
    "discount": 5.0,
    "tax": 18.27,
    "total": 105.25,
    "payment_method": "EFECTIVO",
    "status": "COMPLETED",
    "created_at": "2024-01-15T10:30:00Z",
    "items": [
        {
            "product_id": "product-uuid",
            "product_name": "Auriculares Bluetooth",
            "quantity": 2,
            "unit_price": 45.99,
            "subtotal": 91.98
        }
    ]
}
```

#### 8. Ver Reportes

**Frontend** (`/dashboard`):

-   Ver resumen de ventas del día
-   Ver ventas del mes
-   Ver productos con stock bajo
-   Ver productos más vendidos

**API Requests**:

```bash
# Dashboard stats
curl "http://localhost:3000/api/reports/dashboard?business_id=$BUSINESS_ID" \
  -H "Authorization: Bearer $TOKEN"

# Top products
curl "http://localhost:3000/api/reports/top-products?business_id=$BUSINESS_ID&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

#### 9. Cerrar Caja

**Frontend** (`/dashboard` o `/pos`):

-   Click en "Cerrar Caja"
-   Ingresar monto de cierre (conteo físico)
-   Confirmar cierre
-   Ver diferencia (esperado vs real)

**API Request**:

```bash
curl -X POST http://localhost:3000/api/cash-register/close \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "closing_amount": 1250.75
  }'
```

---

## Casos de Uso Comunes

### Caso 1: Ajuste de Inventario

**Situación**: Recibiste un nuevo envío de mercancía.

```bash
curl -X POST http://localhost:3000/api/stock/movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "product_id": "'$PRODUCT_ID'",
    "quantity": 50,
    "type": "IN",
    "reason": "Reposición de stock - Proveedor XYZ"
  }'
```

### Caso 2: Producto Dañado

**Situación**: Se dañaron 3 unidades de un producto.

```bash
curl -X POST http://localhost:3000/api/stock/movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "product_id": "'$PRODUCT_ID'",
    "quantity": -3,
    "type": "ADJUSTMENT",
    "reason": "Productos dañados - No vendibles"
  }'
```

### Caso 3: Cancelar Venta

**Situación**: Cliente devuelve un producto.

**Frontend** (`/reports`):

-   Buscar la venta
-   Click en "Cancelar Venta"
-   Confirmar cancelación

**API Request**:

```bash
SALE_ID="sale-uuid"

curl -X POST "http://localhost:3000/api/sales/$SALE_ID/cancel" \
  -H "Authorization: Bearer $TOKEN"
```

**Efectos**:

-   Venta marcada como CANCELLED
-   Stock restaurado automáticamente
-   No afecta el total de la caja

### Caso 4: Cambiar Precio de Producto

**Frontend** (`/products`):

-   Click en producto a editar
-   Modificar precio
-   Guardar cambios

**API Request**:

```bash
curl -X PUT "http://localhost:3000/api/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "price": 49.99
  }'
```

### Caso 5: Desactivar Producto

**Situación**: Ya no venderás un producto pero quieres mantener su historial.

```bash
curl -X PUT "http://localhost:3000/api/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "is_active": false
  }'
```

### Caso 6: Buscar Ventas de un Cliente

**Frontend** (`/customers`):

-   Click en un cliente
-   Ver historial de compras

**API Request**:

```bash
curl "http://localhost:3000/api/sales?business_id=$BUSINESS_ID&customer_id=$CUSTOMER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Caso 7: Ventas por Período

**Frontend** (`/reports`):

-   Seleccionar fechas de inicio y fin
-   Ver listado de ventas filtradas

**API Request**:

```bash
curl "http://localhost:3000/api/sales?business_id=$BUSINESS_ID&start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Ejemplos de Frontend

### Ejemplo 1: Formato de Moneda

```typescript
import { formatCurrency } from "../utils/helpers";

const price = 1234.56;
const formatted = formatCurrency(price, "USD");
console.log(formatted); // "$1,234.56"
```

### Ejemplo 2: Validación de Email

```typescript
import { isValidEmail } from "../utils/helpers";

const email = "user@example.com";
if (isValidEmail(email)) {
    // Proceder con registro
} else {
    showError("Email inválido");
}
```

### Ejemplo 3: Almacenamiento Local

```typescript
import { storage } from "../utils/helpers";

// Guardar negocio actual
storage.set("currentBusiness", businessData);

// Recuperar negocio
const business = storage.get<Business>("currentBusiness");

// Limpiar al cerrar sesión
storage.clear();
```

### Ejemplo 4: Debouncing en Búsqueda

```typescript
import { debounce } from "../utils/helpers";

const searchProducts = debounce((query: string) => {
    api.getProducts(businessId).then((products) => {
        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    });
}, 300);

// En el input
<input
    type="text"
    onChange={(e) => searchProducts(e.target.value)}
    placeholder="Buscar producto..."
/>;
```

### Ejemplo 5: Manejo de Errores en API

```typescript
import { api } from "../lib/api";

async function createProduct(data: ProductForm) {
    try {
        const product = await api.createProduct(data);
        showSuccess("Producto creado exitosamente");
        return product;
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.status === 400) {
                showError("Datos inválidos. Verifica el formulario.");
            } else if (error.status === 401) {
                showError("Sesión expirada. Inicia sesión nuevamente.");
                api.logout();
            } else {
                showError(error.message);
            }
        } else {
            showError("Error de conexión. Intenta de nuevo.");
        }
    }
}
```

---

## Ejemplos de Validación

### Backend - Validar Producto

```javascript
const { validate, schemas } = require("../utils/validators");

// En el controller
exports.createProduct = asyncHandler(async (req, res) => {
    // Validar datos
    validate(req.body, schemas.product);

    // Si llega aquí, los datos son válidos
    const product = await createProductInDB(req.body);
    res.status(201).json(product);
});
```

### Frontend - Validar Formulario

```typescript
import { isValidEmail, isEmpty } from "../utils/helpers";

function validateProductForm(data: ProductForm): string[] {
    const errors: string[] = [];

    if (isEmpty(data.name)) {
        errors.push("El nombre es requerido");
    }

    if (!data.price || data.price <= 0) {
        errors.push("El precio debe ser mayor a 0");
    }

    if (data.stock && data.stock < 0) {
        errors.push("El stock no puede ser negativo");
    }

    return errors;
}

// Uso
const errors = validateProductForm(formData);
if (errors.length > 0) {
    showErrors(errors);
    return;
}
```

---

## Tips de Uso

### 1. Búsqueda Rápida en POS

-   **Por SKU**: Escanea o escribe el SKU completo
-   **Por Nombre**: Escribe parte del nombre, se filtrará automáticamente

### 2. Atajos de Teclado (Futuro)

```
Ctrl + N: Nuevo producto
Ctrl + S: Guardar
Ctrl + F: Buscar
Escape: Cerrar modal
```

### 3. Gestión de Stock

-   ✅ **Recomendado**: Usar movimientos de inventario para ajustes
-   ❌ **Evitar**: Editar stock directamente en productos

### 4. Reportes Precisos

-   Cierra la caja al final de cada día
-   Mantén registros de ventas canceladas
-   Revisa productos con stock bajo regularmente

### 5. Seguridad

-   No compartas tokens de acceso
-   Cambia las contraseñas regularmente
-   Asigna roles apropiados (ADMIN vs EMPLEADO)

---

¿Necesitas más ejemplos? Consulta:

-   [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) para referencia completa de endpoints
-   [BEST_PRACTICES.md](frontend/BEST_PRACTICES.md) para patrones de código frontend
-   [TESTING_GUIDE.md](backend/TESTING_GUIDE.md) para ejemplos de testing
