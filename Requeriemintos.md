# Documento de Requerimientos – Sistema POS Web

## 1. Introducción

### 1.1 Propósito

Este documento describe de forma completa los requerimientos funcionales y no funcionales del **Sistema POS (Point of Sale) Web**, orientado a pequeños y medianos comercios. El objetivo es servir como guía única para el diseño, desarrollo, implementación y validación del sistema.

### 1.2 Alcance del sistema

El POS permitirá a los comercios:

-   Registrar ventas de forma rápida.
-   Gestionar productos, clientes y stock.
-   Controlar caja diaria.
-   Consultar reportes básicos.
-   Operar desde navegador web, con soporte offline limitado.

El sistema se ofrecerá como **aplicación web multi-tenant** (varios comercios en una misma plataforma).

### 1.3 Público objetivo

-   Desarrolladores (referencia técnica)
-   Evaluadores técnicos (portfolio / entrevistas)
-   Potenciales clientes pymes

---

## 2. Stack tecnológico

### 2.1 Backend

-   **Node.js**
-   **Express.js**
-   Arquitectura REST
-   Autenticación JWT (access + refresh)

### 2.2 Frontend

-   **Astro**
-   Componentes en React / Vue (islas)
-   UI responsive (desktop / tablet)

### 2.3 Base de datos

-   **Turso (libSQL)**
-   SQL relacional
-   Multi-tenant por `business_id`

### 2.4 Infraestructura

-   Backend: Fly.io / Railway
-   Frontend: Vercel
-   Almacenamiento local: LocalStorage / IndexedDB

---

## 3. Actores del sistema

### 3.1 Administrador del negocio

-   Configura el negocio
-   Gestiona productos y stock
-   Accede a reportes
-   Cierra caja

### 3.2 Empleado / Cajero

-   Registra ventas
-   Consulta productos
-   No accede a reportes sensibles

### 3.3 Super Admin (sistema)

-   Gestiona comercios
-   Monitorea uso
-   Soporte técnico

---

## 4. Requerimientos funcionales

### 4.1 Autenticación y autorización

**RF-01** El sistema debe permitir registro de usuarios.

**RF-02** El sistema debe permitir inicio de sesión mediante email y contraseña.

**RF-03** El sistema debe implementar JWT con refresh token.

**RF-04** El sistema debe soportar roles:

-   ADMIN
-   EMPLEADO

**RF-05** El acceso a funcionalidades debe estar restringido según rol.

---

### 4.2 Gestión de negocios (multi-tenant)

**RF-06** Un usuario administrador puede crear un negocio.

**RF-07** Cada negocio tiene:

-   Nombre
-   Dirección
-   Moneda
-   Impuestos básicos

**RF-08** Un usuario puede pertenecer a varios negocios.

---

### 4.3 Gestión de productos

**RF-09** El sistema debe permitir crear productos.

Campos mínimos:

-   Nombre
-   SKU / Código
-   Precio
-   Stock
-   Categoría
-   Activo/Inactivo

**RF-10** El sistema debe permitir editar productos.

**RF-11** El sistema debe permitir eliminar productos (soft delete).

**RF-12** El sistema debe permitir búsqueda rápida por nombre o código.

---

### 4.4 Gestión de stock

**RF-13** El stock debe descontarse automáticamente al registrar una venta.

**RF-14** El administrador puede ajustar stock manualmente.

**RF-15** El sistema debe registrar historial de movimientos de stock.

---

### 4.5 Proceso de venta (POS)

**RF-16** El cajero puede iniciar una venta.

**RF-17** El sistema debe permitir agregar múltiples productos a la venta.

**RF-18** El sistema debe calcular total automáticamente.

**RF-19** El sistema debe permitir aplicar descuentos porcentuales o fijos.

**RF-20** El sistema debe permitir seleccionar método de pago:

-   Efectivo
-   Débito
-   Crédito
-   Transferencia

**RF-21** El sistema debe confirmar la venta y persistirla.

---

### 4.6 Caja

**RF-22** El sistema debe permitir abrir caja con monto inicial.

**RF-23** Cada venta debe asociarse a una caja abierta.

**RF-24** El sistema debe permitir cerrar caja.

**RF-25** Al cerrar caja se debe mostrar:

-   Total ventas
-   Total por método de pago
-   Diferencia esperada vs real

---

### 4.7 Clientes (opcional)

**RF-26** El sistema puede permitir asociar un cliente a la venta.

**RF-27** Gestión básica de clientes:

-   Nombre
-   Documento
-   Email

---

### 4.8 Reportes

**RF-28** El administrador puede ver ventas por día.

**RF-29** El sistema debe mostrar productos más vendidos.

**RF-30** El sistema debe mostrar ingresos por rango de fechas.

---

### 4.9 Modo offline (básico)

**RF-31** El sistema debe permitir registrar ventas offline.

**RF-32** Las ventas offline deben sincronizarse al recuperar conexión.

---

## 5. Requerimientos no funcionales

### 5.1 Seguridad

-   Contraseñas hasheadas (bcrypt)
-   Tokens con expiración
-   Validación de inputs

### 5.2 Rendimiento

-   Tiempo de respuesta < 300ms en operaciones comunes
-   Búsqueda de productos optimizada

### 5.3 Usabilidad

-   Flujo de venta en menos de 3 clics
-   Interfaz optimizada para teclado

### 5.4 Escalabilidad

-   Soporte para múltiples negocios
-   Separación lógica por `business_id`

---

## 6. Modelo de datos (alto nivel)

### Entidades principales

-   users
-   businesses
-   user_business
-   products
-   stock_movements
-   sales
-   sale_items
-   cash_registers

---

## 7. API (resumen)

### Autenticación

-   POST /auth/register
-   POST /auth/login
-   POST /auth/refresh

### Productos

-   GET /products
-   POST /products
-   PUT /products/:id
-   DELETE /products/:id

### Ventas

-   POST /sales
-   GET /sales

### Caja

-   POST /cash/open
-   POST /cash/close

---

## 8. Roadmap de desarrollo

### Fase 1 – Core

-   Auth
-   Productos
-   Ventas
-   Caja

### Fase 2 – Gestión

-   Stock
-   Reportes
-   Clientes

### Fase 3 – Avanzado

-   Offline
-   Roles finos
-   Exportaciones
