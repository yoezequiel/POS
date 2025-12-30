# 🚀 Inicio Rápido - Sistema POS

## Configuración en 5 Minutos

### 1️⃣ Backend

```bash
cd backend
npm install
```

Crear `.env`:

```env
PORT=3000
TURSO_DATABASE_URL=libsql://[tu-db].turso.io
TURSO_AUTH_TOKEN=[tu-token]
JWT_ACCESS_SECRET=secret-desarrollo-access
JWT_REFRESH_SECRET=secret-desarrollo-refresh
CORS_ORIGIN=http://localhost:4321
```

Ejecutar:

```bash
npm run migrate   # Crear tablas
npm run dev       # Iniciar servidor
```

### 2️⃣ Frontend

```bash
cd frontend
npm install
```

Crear `.env`:

```env
PUBLIC_API_URL=http://localhost:3000/api
```

Ejecutar:

```bash
npm run dev       # Iniciar frontend
```

### 3️⃣ Acceder

Abrir: `http://localhost:4321`

1. Registrarse
2. Crear un negocio
3. Agregar productos
4. ¡Hacer primera venta!

## 📌 Comandos Útiles

### Backend

```bash
npm run dev      # Desarrollo con hot-reload
npm start        # Producción
npm run migrate  # Ejecutar migraciones
```

### Frontend

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview build
```

## 🆘 Problemas Comunes

### Error de conexión a la base de datos

-   Verificar que TURSO_DATABASE_URL y TURSO_AUTH_TOKEN sean correctos
-   Ejecutar `npm run migrate` para crear las tablas

### CORS Error

-   Verificar que CORS_ORIGIN en backend coincida con la URL del frontend
-   Por defecto: `http://localhost:4321`

### Token inválido

-   Asegurar que JWT_ACCESS_SECRET y JWT_REFRESH_SECRET estén definidos
-   Cerrar sesión y volver a iniciar

## 📊 Datos de Prueba

Después de registrarte, puedes crear:

**Negocio de Ejemplo:**

-   Nombre: Mi Tienda
-   Dirección: Calle Principal 123
-   Moneda: USD
-   Impuesto: 21%

**Productos de Ejemplo:**

-   Coca Cola 500ml - $2.50 - Stock: 50
-   Pan Integral - $1.80 - Stock: 30
-   Leche Entera 1L - $3.20 - Stock: 20

**Primera Venta:**

1. Ir a "Punto de Venta"
2. Hacer clic en productos para agregar al carrito
3. Seleccionar método de pago
4. "Completar Venta"

## 🔗 Enlaces Útiles

-   [Documentación Turso](https://docs.turso.tech)
-   [Documentación Astro](https://docs.astro.build)
-   [Express.js](https://expressjs.com)

## ✅ Checklist Inicial

-   [ ] Node.js 18+ instalado
-   [ ] Cuenta en Turso creada
-   [ ] Base de datos Turso creada
-   [ ] Backend corriendo en :3000
-   [ ] Frontend corriendo en :4321
-   [ ] Migraciones ejecutadas
-   [ ] Usuario registrado
-   [ ] Negocio creado
-   [ ] Productos agregados
-   [ ] Primera venta realizada

¡Listo para vender! 🎉
