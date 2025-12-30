# SEO y Meta Tags - Guía de Uso

## 🎨 Favicon

El proyecto incluye un favicon SVG que se muestra en las pestañas del navegador:

```
/frontend/public/favicon.svg
```

Este archivo se carga automáticamente en todos los layouts a través de:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

## 📷 Imágenes Open Graph

Se incluyen dos versiones de la imagen OG:

-   `/frontend/public/og-image.svg` - Imagen vectorial (recomendada)
-   `/frontend/public/og-image.png` - Alternativa en formato PNG

Estas imágenes se muestran cuando compartes enlaces del sitio en redes sociales.

## 🏷️ Meta Tags

### Configuración Automática

Todos los layouts (`BaseLayout`, `AppLayout`, `AuthLayout`) incluyen automáticamente:

-   ✅ Meta tags básicos (title, description)
-   ✅ Open Graph tags (Facebook, LinkedIn)
-   ✅ Twitter Card tags
-   ✅ Canonical URLs
-   ✅ Locale (es_ES)
-   ✅ Theme color

### Uso en Páginas

#### Opción 1: A través de los layouts (Recomendado)

```astro
---
import AppLayout from "../layouts/AppLayout.astro";
---

<AppLayout
    title="Mi Página"
    description="Descripción específica de esta página">
    <!-- contenido -->
</AppLayout>
```

#### Opción 2: Usando el componente SEO (Avanzado)

Para control más granular, puedes usar el componente `SEO.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SEO from "../components/SEO.astro";
---

<html>
<head>
    <SEO
        title="Título Personalizado"
        description="Descripción personalizada"
        image="/mi-imagen-custom.png"
        type="article"
        noindex={false}
    />
</head>
<body>
    <!-- contenido -->
</body>
</html>
```

## 📋 Props Disponibles

### BaseLayout / AppLayout / AuthLayout

| Prop          | Tipo   | Requerido | Default                                 |
| ------------- | ------ | --------- | --------------------------------------- |
| `title`       | string | ✅ Sí     | -                                       |
| `description` | string | ❌ No     | "Sistema de Punto de Venta completo..." |
| `image`       | string | ❌ No     | "/og-image.svg"                         |

### Componente SEO

| Prop          | Tipo                   | Requerido | Default                                 |
| ------------- | ---------------------- | --------- | --------------------------------------- |
| `title`       | string                 | ❌ No     | "POS System"                            |
| `description` | string                 | ❌ No     | "Sistema de Punto de Venta completo..." |
| `image`       | string                 | ❌ No     | "/og-image.svg"                         |
| `type`        | 'website' \| 'article' | ❌ No     | 'website'                               |
| `noindex`     | boolean                | ❌ No     | false                                   |

## 🎯 Ejemplos de Uso

### Página de Landing

```astro
<BaseLayout
    title="Bienvenido"
    description="El mejor sistema POS para tu negocio"
    image="/landing-og.png">
```

### Blog/Artículo

```astro
<SEO
    title="Cómo optimizar tus ventas"
    description="10 consejos para aumentar ventas..."
    type="article"
    image="/blog/article-image.png"
/>
```

### Páginas privadas (sin indexar)

```astro
<SEO
    title="Panel de Administración"
    noindex={true}
/>
```

## 🔍 Validación

Para verificar que los meta tags funcionan correctamente:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/

## 🎨 Personalización de Imágenes

Para crear imágenes OG personalizadas:

-   **Tamaño recomendado**: 1200x630px
-   **Formato**: PNG, JPG o SVG
-   **Ubicación**: `/frontend/public/`
-   **Uso**: Especifica la ruta en la prop `image`

## 📱 Theme Color

El color del tema (`#3b82f6`) se define en el `BaseLayout` y afecta:

-   Barra de navegación en móviles
-   Color de la interfaz del navegador
-   Splash screen en PWA

Para cambiar:

```html
<meta name="theme-color" content="#tu-color" />
```
