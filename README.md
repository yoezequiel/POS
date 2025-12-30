# 🏪 Sistema POS (Point of Sale) Web

Sistema completo de punto de venta web con gestión de inventario, ventas, clientes y reportes. Desarrollado con **Node.js**, **Express**, **Turso (libSQL)**, **Astro** y **React**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

> 🎯 **Demo Lista**: Ejecuta `npm run seed` para poblar la base de datos con datos realistas y prueba con: **demo@pos.com** / **demo123**

## ✨ Características Destacadas

-   🔐 **Autenticación Segura**: JWT con refresh tokens automáticos
-   🏢 **Multi-tenant**: Gestión de múltiples negocios por usuario
-   📦 **Inventario Completo**: Control de stock en tiempo real con historial
-   💰 **POS Intuitivo**: Interfaz rápida para ventas con múltiples métodos de pago
-   👥 **Gestión de Clientes**: Registro y seguimiento de clientes
-   📊 **Reportes y Analytics**: Dashboard con métricas clave y productos top
-   🔒 **Seguridad**: Best practices con bcrypt, validación y control de acceso
-   🌱 **Datos Demo**: Script de seed incluido con 28 productos, 8 clientes y ventas de ejemplo

## 🚀 Estado del Proyecto

### ✅ Implementado (30/32 Requisitos Funcionales)

**Autenticación y Seguridad**

-   ✅ Registro e inicio de sesión de usuarios (RF-01, RF-02)
-   ✅ Autenticación JWT con refresh tokens
-   ✅ Sistema multi-tenant por negocio (RF-03)
-   ✅ Control de acceso basado en roles ADMIN/EMPLEADO (RF-04)

**Gestión de Negocios**

-   ✅ Crear y administrar múltiples negocios (RF-03)
-   ✅ Configuración de moneda e impuestos
-   ✅ Gestión de usuarios por negocio (RF-04, RF-05)

**Gestión de Productos**

-   ✅ CRUD completo de productos (RF-06, RF-07, RF-08, RF-09)
-   ✅ Categorización de productos (RF-11)
-   ✅ Control de stock en tiempo real (RF-10, RF-12)
-   ✅ Sistema de SKU único
-   ✅ Historial de movimientos de inventario (RF-13)

**Punto de Venta (POS)**

-   ✅ Interfaz intuitiva para ventas rápidas (RF-14)
-   ✅ Búsqueda de productos por nombre o SKU (RF-15)
-   ✅ Aplicación de descuentos (RF-16)
-   ✅ Múltiples métodos de pago (RF-17)
-   ✅ Cálculo automático de impuestos (RF-18)
-   ✅ Registro de ventas completas (RF-19)

**Gestión de Clientes**

-   ✅ Registro de clientes (RF-20, RF-21)
-   ✅ Historial de compras (RF-22)
-   ✅ Datos de contacto

**Caja Registradora**

-   ✅ Apertura/cierre de caja (RF-23, RF-24)
-   ✅ Control de efectivo (RF-25)
-   ✅ Historial de transacciones

**Reportes y Estadísticas**

-   ✅ Dashboard con métricas clave (RF-26)
-   ✅ Productos más vendidos (RF-27)
-   ✅ Ventas por período (RF-28)
-   ✅ Productos con stock bajo (RF-29)
-   ✅ Cancelación de ventas (RF-30)

### 🔄 Pendiente (Fase 3 - Advanced)

-   ⏳ **RF-31, RF-32**: Modo offline con IndexedDB y sincronización
-   Roles y permisos granulares
-   Exportación de reportes (PDF, Excel)
-   Facturación electrónica
-   Sistema de fidelización

## 🛠️ Stack Tecnológico

### Backend

-   **Node.js** + **Express.js**
-   **Turso** (libSQL) - Base de datos serverless
-   **JWT** - Autenticación
-   **bcrypt** - Hash de contraseñas

### Frontend

-   **Astro** - Framework web
-   **React** - Componentes interactivos
-   **CSS** - Estilos modulares
-   **TypeScript** - Tipado estático

### Infraestructura Recomendada

-   Backend: Fly.io / Railway / Render
-   Frontend: Vercel / Netlify
-   Base de datos: Turso Cloud

## 📦 Instalación

### Requisitos Previos

-   Node.js 18+
-   npm o pnpm
-   Cuenta en Turso (https://turso.tech)

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd POS
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` basado en `.env.example`:

```env
PORT=3000
NODE_ENV=development

# Turso Database
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-token-here

# JWT Secrets (cambiar en producción)
JWT_ACCESS_SECRET=tu-secret-super-seguro-access
JWT_REFRESH_SECRET=tu-secret-super-seguro-refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:4321
```

**Crear base de datos en Turso:**

```bash
# Instalar CLI de Turso
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Crear base de datos
turso db create pos-db

# Obtener URL y token
turso db show pos-db
turso db tokens create pos-db
```

**Ejecutar migraciones:**

```bash
npm run migrate
```

**Poblar con datos de demostración (opcional pero recomendado):**

```bash
npm run seed
```

Esto creará:

-   Usuario demo: `demo@pos.com` / `demo123`
-   Un negocio de ejemplo con 28 productos
-   8 clientes
-   8 ventas de ejemplo
-   Movimientos de inventario
-   Historial de caja

**Iniciar servidor:**

```bash
npm run dev
```

El backend estará en `http://localhost:3000`

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env`:

```env
PUBLIC_API_URL=http://localhost:3000/api
```

**Iniciar desarrollo:**

```bash
npm run dev
```

El frontend estará en `http://localhost:4321`

## 🚀 Uso

### Demo Rápido

Si ejecutaste `npm run seed` en el backend, puedes probar inmediatamente:

1. Abre `http://localhost:4321/login`
2. Usa las credenciales mostradas en pantalla:
    - **Email**: demo@pos.com
    - **Password**: demo123
3. Explora el sistema con datos realistas precargados

### Primera Vez (Sin Seed)

1. Abrir `http://localhost:4321`
2. Registrar un usuario nuevo
3. Crear un negocio
4. Agregar productos
5. ¡Empezar a vender!

### Flujo de Trabajo Típico

1. **Abrir Caja** - Iniciar turno con monto inicial
2. **Registrar Ventas** - Usar la interfaz POS
3. **Gestionar Stock** - Ajustar inventario
4. **Cerrar Caja** - Finalizar turno y cuadrar
5. **Ver Reportes** - Analizar ventas y productos

## 📊 API Endpoints

### Autenticación

```
POST   /api/auth/register    - Registro
POST   /api/auth/login       - Inicio de sesión
POST   /api/auth/refresh     - Renovar token
POST   /api/auth/logout      - Cerrar sesión
```

### Negocios

```
POST   /api/businesses       - Crear negocio
GET    /api/businesses       - Listar negocios
GET    /api/businesses/:id   - Obtener negocio
PUT    /api/businesses/:id   - Actualizar negocio
```

### Productos

```
GET    /api/products              - Listar productos
POST   /api/products              - Crear producto
GET    /api/products/:id          - Obtener producto
PUT    /api/products/:id          - Actualizar producto
DELETE /api/products/:id          - Eliminar producto
POST   /api/products/categories   - Crear categoría
GET    /api/products/categories   - Listar categorías
```

### Ventas

```
POST   /api/sales            - Registrar venta
GET    /api/sales            - Listar ventas
GET    /api/sales/:id        - Obtener venta
POST   /api/sales/:id/cancel - Cancelar venta
```

### Caja

```
POST   /api/cash/open        - Abrir caja
POST   /api/cash/:id/close   - Cerrar caja
GET    /api/cash/current     - Caja actual
GET    /api/cash             - Historial de cajas
```

### Stock

```
POST   /api/stock/adjust     - Ajustar stock
GET    /api/stock/movements  - Movimientos
GET    /api/stock/low-stock  - Stock bajo
```

### Clientes

```
POST   /api/customers        - Crear cliente
GET    /api/customers        - Listar clientes
GET    /api/customers/:id    - Obtener cliente
PUT    /api/customers/:id    - Actualizar cliente
DELETE /api/customers/:id    - Eliminar cliente
```

### Reportes

```
GET    /api/reports/sales           - Reporte de ventas
GET    /api/reports/top-products    - Productos más vendidos
GET    /api/reports/payment-methods - Métodos de pago
GET    /api/reports/dashboard       - Estadísticas dashboard
```

## 🗄️ Modelo de Datos

### Tablas Principales

-   **users** - Usuarios del sistema
-   **businesses** - Negocios (multi-tenant)
-   **user_business** - Relación usuarios-negocios
-   **products** - Productos
-   **categories** - Categorías de productos
-   **sales** - Ventas
-   **sale_items** - Items de ventas
-   **cash_registers** - Cajas registradoras
-   **stock_movements** - Movimientos de stock
-   **customers** - Clientes
-   **refresh_tokens** - Tokens de renovación

## 🔒 Seguridad

-   Contraseñas hasheadas con bcrypt
-   Autenticación JWT con tokens de acceso y renovación
-   Tokens de acceso de corta duración (15 min)
-   Tokens de renovación de larga duración (7 días)
-   Validación de permisos por negocio
-   Protección CORS configurada

## 📱 Responsive

El sistema está optimizado para:

-   💻 Desktop (diseño principal)
-   📱 Tablet (funcionalidad completa)
-   📱 Mobile (vista adaptada)

## 🧪 Testing

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## 📦 Build para Producción

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## 🚢 Deploy

### Backend (Fly.io)

```bash
cd backend
fly launch
fly deploy
```

### Frontend (Vercel)

```bash
cd frontend
vercel
```

## 📝 Roadmap

### Versión 1.1

-   [ ] Modo offline con IndexedDB
-   [ ] PWA (Progressive Web App)
-   [ ] Notificaciones push

### Versión 1.2

-   [ ] Roles y permisos avanzados
-   [ ] Multi-sucursal
-   [ ] Reportes avanzados con gráficos

### Versión 2.0

-   [ ] Facturación electrónica
-   [ ] Integración con pasarelas de pago
-   [ ] App móvil nativa
-   [ ] Sistema de fidelización

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👤 Autor

Sistema desarrollado como portfolio/proyecto educativo.

## 🙏 Agradecimientos

-   [Astro](https://astro.build)
-   [Turso](https://turso.tech)
-   [Express.js](https://expressjs.com)

---

**¿Preguntas o sugerencias?** Abre un issue en el repositorio.
