# Contributing to POS System

¡Gracias por tu interés en contribuir! Este documento proporciona las pautas para contribuir al proyecto.

## 🚀 Cómo Empezar

1. **Fork el repositorio**
2. **Clona tu fork**:
    ```bash
    git clone https://github.com/tu-usuario/POS.git
    cd POS
    ```
3. **Crea una rama para tu feature**:
    ```bash
    git checkout -b feature/nombre-descriptivo
    ```
4. **Configura el entorno de desarrollo** (ver README.md)

## 📝 Guías de Código

### Backend (Node.js/Express)

#### Estructura de Archivos

-   Controladores: `backend/src/controllers/`
-   Rutas: `backend/src/routes/`
-   Middleware: `backend/src/middleware/`
-   Utilidades: `backend/src/utils/`

#### Estilo de Código

```javascript
// Usar camelCase para variables y funciones
const userName = "John";
function getUserById(id) {}

// Usar PascalCase para clases
class UserController {}

// Usar UPPER_SNAKE_CASE para constantes
const MAX_LOGIN_ATTEMPTS = 5;

// Siempre usar async/await (no callbacks)
async function fetchData() {
    try {
        const data = await db.query();
        return data;
    } catch (error) {
        logger.error("Error fetching data:", error);
        throw error;
    }
}

// Documentar funciones complejas
/**
 * Calculate total with tax and discount
 * @param {number} subtotal - Initial amount
 * @param {number} discount - Discount amount
 * @param {number} taxRate - Tax rate as decimal
 * @returns {number} Final total
 */
function calculateTotal(subtotal, discount, taxRate) {
    // ...
}
```

#### Error Handling

```javascript
// Usar custom error classes
const { ValidationError, NotFoundError } = require("../utils/errorHandler");

// En controladores, siempre usar asyncHandler
const { asyncHandler } = require("../utils/errorHandler");

exports.getProduct = asyncHandler(async (req, res) => {
    const product = await db.get("SELECT * FROM products WHERE id = ?", [
        req.params.id,
    ]);
    if (!product) {
        throw new NotFoundError("Product not found");
    }
    res.json(product);
});
```

#### Validación

```javascript
// Usar el sistema de validación centralizado
const { validate, schemas } = require("../utils/validators");

exports.createProduct = asyncHandler(async (req, res) => {
    validate(req.body, schemas.product);
    // ... crear producto
});
```

### Frontend (Astro/TypeScript)

#### Estructura de Archivos

-   Páginas: `frontend/src/pages/`
-   Layouts: `frontend/src/layouts/`
-   Componentes: `frontend/src/components/` (futuro)
-   Utilidades: `frontend/src/utils/`
-   Tipos: `frontend/src/types/`

#### Estilo de Código TypeScript

```typescript
// Siempre tipar las variables
const user: User = await api.getUser(id);

// Usar interfaces para objetos
interface ProductFormData {
    name: string;
    price: number;
    stock?: number;
}

// Tipar funciones
function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency,
    }).format(amount);
}

// Usar tipos de API importados
import type { Product, Sale } from "../types";

// Evitar 'any'
// ❌ Bad
const data: any = await fetch();

// ✅ Good
const data: ApiResponse = await fetch();
```

#### Componentes React

```typescript
// Usar TypeScript para props
interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
    return (
        <button onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );
}
```

## 🧪 Testing

### Antes de Enviar un PR

1. **Prueba tu código localmente**:

    ```bash
    # Backend
    cd backend
    npm run dev

    # Frontend
    cd frontend
    npm run dev
    ```

2. **Verifica que no hay errores de TypeScript**:

    ```bash
    cd frontend
    npm run build
    ```

3. **Prueba manualmente las funcionalidades afectadas**

4. **Verifica el formato del código** (si hay configuración):
    ```bash
    npm run lint
    npm run format
    ```

### Writing Tests (Futuro)

Cuando se implementen tests:

```javascript
// Unit test example
describe("calculateTotal", () => {
    it("calculates total with tax and discount", () => {
        const result = calculateTotal(100, 10, 0.21);
        expect(result).toBe(108.9);
    });
});

// Integration test example
describe("POST /api/products", () => {
    it("creates a new product", async () => {
        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Test Product", price: 10 });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });
});
```

## 🔀 Pull Request Process

1. **Actualiza tu rama con main**:

    ```bash
    git fetch upstream
    git rebase upstream/main
    ```

2. **Asegúrate de que tus commits son descriptivos**:

    ```bash
    # ❌ Bad
    git commit -m "fix"

    # ✅ Good
    git commit -m "fix: resolve stock calculation error in sales controller"
    ```

    Formato recomendado:

    - `feat:` nueva funcionalidad
    - `fix:` corrección de bug
    - `docs:` cambios en documentación
    - `style:` formato, sin cambios de código
    - `refactor:` refactorización de código
    - `test:` agregar o modificar tests
    - `chore:` cambios en build, dependencias, etc.

3. **Crea el Pull Request**:

    - Título descriptivo
    - Descripción clara de los cambios
    - Menciona issues relacionados (#123)
    - Incluye screenshots si aplica

4. **Template de PR**:

    ```markdown
    ## Descripción

    Breve descripción de los cambios

    ## Tipo de cambio

    -   [ ] Bug fix
    -   [ ] Nueva funcionalidad
    -   [ ] Breaking change
    -   [ ] Documentación

    ## ¿Cómo se ha probado?

    Describe las pruebas realizadas

    ## Checklist

    -   [ ] El código sigue el estilo del proyecto
    -   [ ] He probado mi código
    -   [ ] He actualizado la documentación
    -   [ ] No hay warnings ni errores
    ```

## 📦 Commits

### Mensajes de Commit

Usa el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

**Ejemplos**:

```bash
feat(auth): add password reset functionality
fix(sales): correct tax calculation for discounted items
docs(readme): update installation instructions
refactor(api): simplify error handling middleware
```

### Atomic Commits

-   Cada commit debe ser una unidad lógica completa
-   Un commit = una funcionalidad/fix
-   No mezclar múltiples cambios no relacionados

## 🐛 Reportar Bugs

Al reportar un bug, incluye:

1. **Descripción clara** del problema
2. **Pasos para reproducir**:
    - Paso 1
    - Paso 2
    - ...
3. **Comportamiento esperado**
4. **Comportamiento actual**
5. **Screenshots** (si aplica)
6. **Entorno**:
    - OS: [e.g., Ubuntu 22.04]
    - Node version: [e.g., 18.17.0]
    - Browser: [e.g., Chrome 120]

## 💡 Sugerir Funcionalidades

Al proponer una nueva funcionalidad:

1. **Describe el problema** que resuelve
2. **Propón una solución**
3. **Considera alternativas**
4. **Estima el impacto** (usuarios afectados, breaking changes, etc.)

## 🎨 Diseño y UX

-   Mantén consistencia con el diseño existente
-   Usa los colores y estilos definidos en `global.css`
-   Asegura responsive design (móvil, tablet, desktop)
-   Considera accesibilidad (ARIA labels, contraste, navegación por teclado)

## 🔒 Seguridad

Si encuentras una vulnerabilidad de seguridad:

1. **NO abras un issue público**
2. **Contacta** directamente (email del maintainer)
3. Proporciona detalles del problema
4. Espera respuesta antes de divulgar

## 📖 Documentación

Al agregar nuevas funcionalidades:

-   Actualiza el README si es necesario
-   Documenta endpoints en API_DOCUMENTATION.md
-   Agrega JSDoc/comentarios a funciones complejas
-   Actualiza ARCHITECTURE.md si cambias patrones

## 🤝 Código de Conducta

-   Sé respetuoso y constructivo
-   Acepta feedback positivamente
-   Ayuda a otros contributors
-   Mantén un ambiente profesional

## 📞 Contacto

-   **Issues**: Para bugs y features
-   **Discussions**: Para preguntas generales
-   **Email**: [tu-email] para temas sensibles

---

¡Gracias por contribuir al proyecto POS! 🎉
