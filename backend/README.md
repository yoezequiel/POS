# POS Backend API

Backend API para el Sistema POS Web.

## Tecnologías

-   Node.js + Express.js
-   Turso (libSQL) - Base de datos
-   JWT - Autenticación
-   Multi-tenant

## Instalación

```bash
npm install
```

## Configuración

1. Copiar `.env.example` a `.env`
2. Configurar las variables de entorno (Turso DB, JWT secrets)

## Ejecutar migraciones

```bash
npm run migrate
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm start
```

## API Endpoints

### Autenticación

-   `POST /api/auth/register` - Registro de usuario
-   `POST /api/auth/login` - Inicio de sesión
-   `POST /api/auth/refresh` - Renovar token

### Negocios

-   `POST /api/businesses` - Crear negocio
-   `GET /api/businesses` - Listar negocios del usuario

### Productos

-   `GET /api/products` - Listar productos
-   `POST /api/products` - Crear producto
-   `PUT /api/products/:id` - Actualizar producto
-   `DELETE /api/products/:id` - Eliminar producto

### Ventas

-   `POST /api/sales` - Registrar venta
-   `GET /api/sales` - Listar ventas

### Caja

-   `POST /api/cash/open` - Abrir caja
-   `POST /api/cash/close` - Cerrar caja
-   `GET /api/cash/current` - Caja actual

### Reportes

-   `GET /api/reports/sales` - Reporte de ventas
-   `GET /api/reports/products` - Productos más vendidos
