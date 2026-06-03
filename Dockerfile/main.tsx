# ============================================
# STAGE 1: Build de Vite
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm
RUN npm install -g pnpm@10.17.1

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Build de producción con Vite
RUN pnpm run build

# ============================================
# STAGE 2: Nginx para servir archivos estáticos
# ============================================
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados desde el stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 8080 (requerido por Cloud Run)
EXPOSE 8080

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
