# 🛍️ SOLEM - Tienda Online de Joyas en Plata 925

Tienda e-commerce elegante para joyas de plata 925 con diseño en paleta crema y verde salvia.

## ✨ Características

- 🎨 **Diseño elegante** con paleta crema (#F5F0E8) y verde salvia (#6B8F71)
- 🛒 **Carrito de compras** que finaliza por WhatsApp
- 📦 **Sistema de variantes** por producto (tallas, medidas)
- 🎨 **Variantes de colores** con fotos específicas por color
- 🔒 **Panel de administración** protegido con Firebase Auth
- ☁️ **Stock en tiempo real** con Firebase Firestore
- 🌐 **Arquitectura Serverless** lista para Google Cloud Run
- 📱 **Responsive** - se adapta a mobile y desktop
- 🖼️ **Formato cuadrado** para todas las imágenes de productos

## 🏗️ Arquitectura

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Base de datos**: Firebase Firestore (tiempo real)
- **Autenticación**: Firebase Auth (solo admin)
- **Despliegue**: Google Cloud Run con Nginx

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# Ejecutar en modo desarrollo
pnpm run dev
```

Abrir [http://localhost:5173](http://localhost:5173)

### Build de Producción

```bash
pnpm run build
```

Los archivos se generan en `dist/`

## 🔧 Configuración

Ver [SETUP.md](./SETUP.md) para:
- Configuración completa de Firebase
- Creación del usuario administrador
- Despliegue en Google Cloud Run
- Configuración de dominio personalizado

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── components/         # Componentes React
│   │   ├── AdminLogin.tsx  # Login de administrador
│   │   ├── AdminPanel.tsx  # Panel de gestión
│   │   ├── CartDrawer.tsx  # Carrito de compras
│   │   ├── Hero.tsx        # Página de inicio
│   │   ├── Navbar.tsx      # Navegación
│   │   ├── ProductGrid.tsx # Grilla de productos
│   │   └── ...
│   ├── config/
│   │   └── firebase.ts     # Configuración de Firebase
│   ├── context/
│   │   └── StoreContext.tsx # Estado global
│   └── App.tsx             # Componente raíz
├── styles/
│   ├── fonts.css           # Fuentes personalizadas
│   └── theme.css           # Variables CSS de Tailwind
└── imports/                # Assets importados
```

## 🔐 Rutas

- `/` - Página de inicio
- `/products` - Catálogo de productos
- `/login` - Login de administrador
- `/admin` - Panel de administración (protegido)

## 🛠️ Tecnologías

- React 18.3
- TypeScript
- Vite 6.3
- Tailwind CSS 4.1
- Firebase 12.14
- React Router 7.16
- Lucide React (iconos)

## 📸 Gestión de Imágenes

- **Formato requerido**: Cuadrado (mismo ancho y alto)
- **Validación automática**: Al subir desde PC
- **Múltiples colores**: Cada color puede tener su propia foto

## 🎯 Flujo de Compra

1. Cliente navega la tienda (sin login)
2. Agrega productos al carrito
3. Selecciona variantes (tallas, colores)
4. Click en "Finalizar compra"
5. Se abre WhatsApp con el pedido formateado

## 👨‍💼 Panel de Administración

Funcionalidades del admin:
- ✅ Agregar/editar/eliminar productos
- ✅ Gestionar stock por variante
- ✅ Activar/desactivar productos
- ✅ Agregar colores con fotos específicas
- ✅ Gestionar carrusel de inicio
- ✅ Vista en tiempo real del inventario

## 🐳 Docker

```bash
# Build
docker build -t solem-tienda .

# Run local
docker run -p 8080:8080 solem-tienda

# Deploy to Cloud Run
gcloud run deploy solem-tienda \
  --image gcr.io/PROJECT_ID/solem-tienda \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated
```

## 📝 Variables de Entorno

Ver `.env.example` para la lista completa de variables requeridas.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 🤝 Contribuir

Este es un proyecto privado. Para sugerencias o bugs, contactar al propietario.

## 📄 Licencia

Privado - Todos los derechos reservados © SOLEM 2026
