# 🎨 Guía de Diseño - POS System

## Paleta de Colores Moderna

### Colores Principales

-   **Primary**: `#6366f1` (Indigo vibrante)
-   **Primary Dark**: `#4f46e5`
-   **Secondary**: `#10b981` (Verde éxito)
-   **Danger**: `#ef4444` (Rojo)
-   **Warning**: `#f59e0b` (Ámbar)

### Colores Neutrales

-   **Text**: `#0f172a` (Slate 900)
-   **Text Secondary**: `#475569` (Slate 600)
-   **Text Light**: `#94a3b8` (Slate 400)
-   **Border**: `#e2e8f0` (Slate 200)
-   **Background**: `#f8fafc` (Slate 50)

## Tipografía

### Fuente

**Inter** - Fuente moderna y profesional de Google Fonts

### Pesos utilizados

-   Light (300) - Textos sutiles
-   Regular (400) - Cuerpo de texto
-   Medium (500) - Navegación y botones
-   Semibold (600) - Labels y subtítulos
-   Bold (700) - Títulos
-   Extrabold (800) - Encabezados principales

## Espaciado

### Sistema de Espaciado Consistente

-   **xs**: 0.25rem (4px)
-   **sm**: 0.5rem (8px)
-   **md**: 1rem (16px)
-   **lg**: 1.5rem (24px)
-   **xl**: 2rem (32px)
-   **2xl**: 3rem (48px)

## Bordes y Radios

### Border Radius

-   **sm**: 0.375rem (6px) - Badges, botones pequeños
-   **base**: 0.5rem (8px) - Botones, inputs
-   **md**: 0.75rem (12px) - Botones grandes
-   **lg**: 1rem (16px) - Cards
-   **xl**: 1.5rem (24px) - Modales, containers principales
-   **full**: 9999px - Pills, badges circulares

## Sombras

### Sistema de Elevación

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Componentes Clave

### Botones

-   **Gradientes sutiles** en colores primarios
-   **Elevación en hover** (translateY(-2px))
-   **Efecto de brillo** con pseudo-elemento ::before
-   **Estados claros** (hover, active, disabled)

### Cards

-   **Bordes sutiles** (#f1f5f9)
-   **Hover con elevación** para interactividad
-   **Padding generoso** (1.75rem)
-   **Border-radius grande** (1rem)

### Formularios

-   **Focus con anillo de color** (4px rgba indigo)
-   **Bordes más gruesos** (1.5px)
-   **Transiciones suaves** (150ms cubic-bezier)
-   **Labels en negrita** para mejor legibilidad

### Tablas

-   **Headers con fondo claro** (#f1f5f9)
-   **Texto en mayúsculas pequeñas** para headers
-   **Hover sutil** en filas
-   **Padding generoso** (1rem)

## Animaciones

### Transiciones Base

```css
--transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Animaciones Incluidas

-   **slideDown**: Banner de demo en login
-   **slideUp**: Containers de autenticación
-   **fadeIn**: Contenido principal
-   **float**: Elementos decorativos en background
-   **spin**: Loading spinners

## Mejores Prácticas

### 1. Consistencia

-   Usar siempre variables CSS en lugar de valores hardcoded
-   Mantener el sistema de espaciado consistente
-   Aplicar border-radius según el tamaño del componente

### 2. Accesibilidad

-   Contraste mínimo 4.5:1 para texto normal
-   Contraste mínimo 3:1 para texto grande
-   Focus states claramente visibles
-   Hover states distinguibles

### 3. Responsividad

-   Mobile-first approach
-   Breakpoint principal en 768px
-   Grid colapsa a 1 columna en móvil
-   Padding/spacing reducido en móvil

### 4. Performance

-   Usar transform y opacity para animaciones (GPU accelerated)
-   Evitar animaciones en propiedades como height/width
-   Lazy load de imágenes cuando sea posible
-   Minimizar re-renders con transiciones suaves

## Gradientes

### Principales

```css
/* Primary gradient */
background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);

/* Success gradient */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);

/* Background gradient */
background: linear-gradient(to bottom right, #f8fafc 0%, #e2e8f0 100%);

/* Auth background */
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
```

## Estados Interactivos

### Hover

-   **Botones**: Elevación + sombra más grande
-   **Cards**: Elevación sutil (translateY(-2px))
-   **Links**: Cambio de color + transición suave
-   **Table rows**: Background color sutil

### Active

-   **Botones**: translateY(1px) para simular "presión"
-   Sin active state para elementos no clickeables

### Focus

-   **Inputs**: Borde color primario + anillo de 4px
-   **Botones**: Outline visible para accesibilidad
-   Sin outline en elementos decorativos

### Disabled

-   **Opacidad**: 0.5
-   **Cursor**: not-allowed
-   **Sin interacciones**: pointer-events según contexto

## Iconografía

Se recomienda usar:

-   **Emojis** para íconos decorativos simples (🏪, 📊, 💰)
-   **Lucide Icons** o **Heroicons** para UI profesional
-   **Tamaño consistente**: 1rem (16px) para inline, 1.5rem (24px) para standalone

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
}

/* Tablet */
@media (max-width: 768px) {
}

/* Desktop */
@media (min-width: 1024px) {
}

/* Large Desktop */
@media (min-width: 1280px) {
}
```

## Mejoras Futuras

1. **Dark Mode**: Sistema de temas con toggle
2. **Micro-interacciones**: Animaciones más detalladas
3. **Skeleton loaders**: Para estados de carga
4. **Toasts/Notifications**: Sistema de notificaciones elegante
5. **Modales**: Overlay con backdrop blur
