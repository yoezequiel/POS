# Deployment Guide

Guía completa para desplegar el sistema POS en producción.

## 📋 Prerequisitos

-   Node.js 18+ instalado
-   Cuenta en Turso (base de datos)
-   Cuenta en plataforma de hosting (Vercel, Netlify, Railway, etc.)
-   Dominio (opcional)

## 🎯 Opciones de Deployment

### Opción 1: Vercel + Railway (Recomendado)

**Frontend en Vercel** + **Backend en Railway**

#### 1. Desplegar Backend en Railway

1. **Crear cuenta en [Railway](https://railway.app/)**

2. **Crear nuevo proyecto**:

    - Click en "New Project"
    - Selecciona "Deploy from GitHub repo"
    - Conecta tu repositorio

3. **Configurar variables de entorno**:

    ```env
    NODE_ENV=production
    PORT=3000
    TURSO_DATABASE_URL=libsql://your-db.turso.io
    TURSO_AUTH_TOKEN=your-turso-token
    JWT_SECRET=your-super-secret-key-production
    JWT_REFRESH_SECRET=your-refresh-secret-key-production
    CORS_ORIGIN=https://your-frontend.vercel.app
    ```

4. **Configurar build**:

    - Root Directory: `/backend`
    - Build Command: `npm install`
    - Start Command: `npm start`

5. **Ejecutar migraciones**:

    ```bash
    # Desde tu máquina local con las env vars de producción
    cd backend
    npm run migrate
    ```

6. **Obtener URL del backend** (ej: `https://pos-backend.railway.app`)

#### 2. Desplegar Frontend en Vercel

1. **Crear cuenta en [Vercel](https://vercel.com/)**

2. **Importar proyecto**:

    - Click en "Add New..." → "Project"
    - Conecta tu repositorio de GitHub
    - Selecciona el repositorio POS

3. **Configurar proyecto**:

    - Framework Preset: Astro
    - Root Directory: `frontend`
    - Build Command: `npm run build`
    - Output Directory: `dist`

4. **Configurar variables de entorno**:

    ```env
    PUBLIC_API_URL=https://pos-backend.railway.app/api
    ```

5. **Deploy**:
    - Click en "Deploy"
    - Espera a que termine el build
    - Tu app estará disponible en `https://your-app.vercel.app`

---

### Opción 2: Todo en Railway

**Full-stack deployment en Railway**

1. **Crear dos servicios en Railway**:

    - Service 1: Backend (API)
    - Service 2: Frontend (Static Site)

2. **Backend**:

    - Same configuration as above

3. **Frontend**:
    - Build Command: `npm run build`
    - Start Command: `npx http-server dist -p $PORT`
    - Variables de entorno:
        ```env
        PUBLIC_API_URL=https://backend-service.railway.app/api
        ```

---

### Opción 3: VPS (DigitalOcean, AWS, etc.)

**Deployment en servidor propio**

#### 1. Configurar Servidor

```bash
# Conectar al servidor
ssh user@your-server-ip

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Nginx
sudo apt install nginx -y

# Instalar PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Clonar y Configurar Proyecto

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/POS.git
cd POS

# Backend
cd backend
npm install --production
cp .env.example .env
nano .env  # Editar con variables de producción
npm run migrate

# Frontend
cd ../frontend
npm install
npm run build
```

#### 3. Configurar PM2 para Backend

```bash
cd backend

# Crear ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'pos-backend',
    script: 'src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Seguir instrucciones
```

#### 4. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/pos
```

Contenido:

```nginx
# Backend API
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    root /home/user/POS/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activar configuración:

```bash
sudo ln -s /etc/nginx/sites-available/pos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Configurar SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tudominio.com -d www.tudominio.com -d api.tudominio.com
```

---

## 🔒 Seguridad en Producción

### 1. Variables de Entorno Seguras

```bash
# Generar secretos seguros
openssl rand -base64 32  # Para JWT_SECRET
openssl rand -base64 32  # Para JWT_REFRESH_SECRET
```

### 2. Rate Limiting

Agregar a `backend/src/server.js`:

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
});

app.use("/api/", limiter);
```

Instalar:

```bash
npm install express-rate-limit
```

### 3. Helmet (Headers de seguridad)

Ya está incluido en el proyecto, verifica que esté activo:

```javascript
// backend/src/server.js
const helmet = require("helmet");
app.use(helmet());
```

### 4. CORS Apropiado

```javascript
// backend/src/server.js
const cors = require("cors");

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "https://tudominio.com",
        credentials: true,
    })
);
```

### 5. HTTPS Obligatorio

```javascript
// backend/src/server.js - Redirect HTTP to HTTPS
if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
        if (req.header("x-forwarded-proto") !== "https") {
            res.redirect(`https://${req.header("host")}${req.url}`);
        } else {
            next();
        }
    });
}
```

---

## 📊 Monitoreo

### Logs con PM2

```bash
# Ver logs
pm2 logs pos-backend

# Monitorear recursos
pm2 monit

# Ver estado
pm2 status
```

### Logging Avanzado

El proyecto ya incluye un logger estructurado. Para persistir logs:

```javascript
// backend/src/utils/logger.js
const fs = require("fs");
const path = require("path");

class Logger {
    constructor() {
        this.logFile = path.join(
            __dirname,
            "../../logs",
            `${new Date().toISOString().split("T")[0]}.log`
        );
        if (!fs.existsSync(path.dirname(this.logFile))) {
            fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
        }
    }

    log(level, message, meta = {}) {
        const logEntry = this.formatMessage(level, message, meta);
        console.log(logEntry);

        // Escribir a archivo
        fs.appendFileSync(this.logFile, logEntry + "\n");
    }

    // ... resto del código
}
```

---

## 🔄 Continuous Deployment

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
    push:
        branches: [main]

jobs:
    deploy-backend:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v2

            - name: Deploy to Railway
              uses: railway-app/railway-deploy@v1
              with:
                  api-token: ${{ secrets.RAILWAY_TOKEN }}
                  service: pos-backend

    deploy-frontend:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v2

            - name: Deploy to Vercel
              uses: amondnet/vercel-action@v20
              with:
                  vercel-token: ${{ secrets.VERCEL_TOKEN }}
                  vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
                  vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
                  working-directory: ./frontend
```

---

## 🗄️ Base de Datos - Turso

### Setup

1. **Crear cuenta en [Turso](https://turso.tech/)**

2. **Instalar Turso CLI**:

    ```bash
    curl -sSfL https://get.tur.so/install.sh | bash
    ```

3. **Autenticar**:

    ```bash
    turso auth login
    ```

4. **Crear base de datos**:

    ```bash
    turso db create pos-production
    ```

5. **Obtener URL y token**:

    ```bash
    turso db show pos-production
    turso db tokens create pos-production
    ```

6. **Usar en .env**:
    ```env
    TURSO_DATABASE_URL=libsql://pos-production-your-org.turso.io
    TURSO_AUTH_TOKEN=your-token-here
    ```

### Backups

```bash
# Backup manual
turso db shell pos-production .dump > backup-$(date +%Y%m%d).sql

# Restaurar
turso db shell pos-production < backup.sql
```

---

## 📈 Optimizaciones

### Compresión

```javascript
// backend/src/server.js
const compression = require("compression");
app.use(compression());
```

```bash
npm install compression
```

### Cache de Assets (Frontend)

Ya configurado en Nginx (ver arriba).

Para CDN, sube el directorio `dist/` a CloudFlare, AWS CloudFront, etc.

---

## ✅ Checklist Pre-Deploy

-   [ ] Variables de entorno configuradas
-   [ ] Secretos JWT generados aleatoriamente
-   [ ] CORS_ORIGIN configurado correctamente
-   [ ] Migraciones ejecutadas en DB de producción
-   [ ] HTTPS configurado
-   [ ] Rate limiting habilitado
-   [ ] Logs configurados
-   [ ] Backups programados
-   [ ] Monitoreo configurado
-   [ ] Dominio apuntando a los servicios
-   [ ] Pruebas en producción realizadas

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"

-   Verifica `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`
-   Asegura que las migraciones se ejecutaron
-   Verifica conectividad con `turso db shell`

### Error: "CORS policy"

-   Verifica `CORS_ORIGIN` en backend
-   Asegura que coincida con URL del frontend
-   Revisa que el frontend usa la URL correcta del backend

### Error: "Token expired"

-   Verifica que `JWT_SECRET` sea el mismo en todos los deployments
-   Asegura que el refresh token funciona
-   Verifica la fecha/hora del servidor

### Frontend no carga

-   Verifica que `PUBLIC_API_URL` apunte al backend correcto
-   Revisa console del navegador para errores
-   Asegura que el build se completó exitosamente

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `pm2 logs` o logs de Railway/Vercel
2. Verifica variables de entorno
3. Consulta la documentación de la plataforma de hosting
4. Abre un issue en GitHub con detalles del error

---

¡Buena suerte con el deployment! 🚀
