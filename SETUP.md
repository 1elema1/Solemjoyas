# Guía de Configuración - SOLEM Tienda Online

Esta guía te ayudará a configurar Firebase y desplegar tu tienda en Google Cloud Run.

---

## 📋 Pre-requisitos

- Una cuenta de Google Cloud Platform
- Node.js 20+ y pnpm instalado
- Docker instalado (para desplegar)
- gcloud CLI instalado

---

## 🔥 Paso 1: Configurar Firebase

### 1.1 Crear proyecto en Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre del proyecto: `solem-tienda` (o el que prefieras)
4. Deshabilitar Google Analytics (opcional)
5. Click en "Crear proyecto"

### 1.2 Habilitar Firestore Database

1. En el menú lateral, ir a **Firestore Database**
2. Click en "Crear base de datos"
3. Seleccionar modo: **Producción**
4. Ubicación: Elegir la más cercana (ej: `southamerica-east1` para Brasil)
5. Click en "Habilitar"

### 1.3 Configurar reglas de seguridad de Firestore

En la pestaña **Reglas**, reemplazar con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lectura pública de productos
    match /products/{productId} {
      allow read: true;
      allow write: if request.auth != null;
    }
  }
}
```

Click en **Publicar**.

### 1.4 Habilitar Firebase Authentication

1. En el menú lateral, ir a **Authentication**
2. Click en "Comenzar"
3. En la pestaña **Sign-in method**, habilitar:
   - **Correo electrónico/Contraseña**: Activar
4. Click en "Guardar"

### 1.5 Crear usuario administrador

1. Ir a **Authentication** > **Users**
2. Click en "Agregar usuario"
3. Ingresar:
   - Email: `admin@solem.com` (o el que prefieras)
   - Contraseña: tu contraseña segura
4. Click en "Agregar usuario"

### 1.6 Obtener credenciales de Firebase

1. Ir a **Configuración del proyecto** (ícono de engranaje)
2. En la sección **Tus aplicaciones**, click en el ícono `</>`  (Web)
3. Registrar app:
   - Nombre: `SOLEM Tienda Web`
   - NO marcar Firebase Hosting
4. Click en "Registrar app"
5. Copiar el objeto `firebaseConfig`

### 1.7 Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

---

## 🚀 Paso 2: Probar localmente

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm run dev
```

Visitar `http://localhost:5173`

### Probar el panel de administración

1. Ir a `http://localhost:5173/login`
2. Iniciar sesión con las credenciales creadas en Firebase Auth
3. Deberías ser redirigido a `/admin`

---

## 📦 Paso 3: Poblar Firestore con productos iniciales

Puedes usar la consola de Firebase o agregar productos desde el panel de administración.

**Opción 1: Usar Firebase Console**

1. Ir a **Firestore Database**
2. Click en "Iniciar colección"
3. ID de colección: `products`
4. Agregar documentos manualmente

**Opción 2: Script de migración (opcional)**

Crear archivo `migrate-products.js`:

```javascript
// Ver archivo de ejemplo en el proyecto
```

---

## 🐳 Paso 4: Desplegar en Google Cloud Run

### 4.1 Preparación

```bash
# Autenticarse en gcloud
gcloud auth login

# Configurar proyecto
gcloud config set project TU_PROJECT_ID

# Habilitar APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 4.2 Build y despliegue

```bash
# Build de la imagen Docker
docker build -t gcr.io/TU_PROJECT_ID/solem-tienda:latest .

# Push a Google Container Registry
docker push gcr.io/TU_PROJECT_ID/solem-tienda:latest

# Desplegar en Cloud Run
gcloud run deploy solem-tienda \
  --image gcr.io/TU_PROJECT_ID/solem-tienda:latest \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars VITE_FIREBASE_API_KEY=tu_api_key,VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com,VITE_FIREBASE_PROJECT_ID=tu_proyecto_id,VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com,VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id,VITE_FIREBASE_APP_ID=tu_app_id
```

### 4.3 Configurar dominio personalizado (opcional)

1. Ir a [Cloud Run Console](https://console.cloud.google.com/run)
2. Seleccionar tu servicio `solem-tienda`
3. Click en "Administrar dominios personalizados"
4. Seguir las instrucciones para verificar tu dominio

---

## 🔒 Consideraciones de Seguridad

1. **Variables de entorno**: Nunca commitear el archivo `.env` a Git
2. **Reglas de Firestore**: Revisar y ajustar según necesidades
3. **CORS**: Si usas un dominio personalizado, configurar CORS en Firebase
4. **Rate limiting**: Considerar implementar rate limiting en Cloud Run

---

## 💡 Comandos útiles

```bash
# Ver logs de Cloud Run
gcloud run services logs read solem-tienda --region=southamerica-east1

# Actualizar el servicio después de cambios
docker build -t gcr.io/TU_PROJECT_ID/solem-tienda:latest .
docker push gcr.io/TU_PROJECT_ID/solem-tienda:latest
gcloud run services update solem-tienda \
  --image gcr.io/TU_PROJECT_ID/solem-tienda:latest \
  --region southamerica-east1

# Ver URL del servicio desplegado
gcloud run services describe solem-tienda \
  --platform managed \
  --region southamerica-east1 \
  --format 'value(status.url)'
```

---

## 🆘 Troubleshooting

### Error: "Firebase: Error (auth/...)"
- Verificar que las credenciales en `.env` sean correctas
- Verificar que Firebase Auth esté habilitado

### Error: "PERMISSION_DENIED" en Firestore
- Verificar las reglas de seguridad de Firestore
- Asegurarse de que el usuario esté autenticado

### Cloud Run no inicia
- Verificar que el puerto sea 8080
- Ver logs: `gcloud run services logs read solem-tienda`

---

## 📞 Soporte

Para más información sobre Firebase y Cloud Run:
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Cloud Run](https://cloud.google.com/run/docs)
