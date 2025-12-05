# Sistema de Gestión de Eventos - Frontend

Frontend desarrollado con React + Vite para el sistema de gestión de eventos.

## Tecnologías Utilizadas

- React 19
- React Router DOM
- React Bootstrap
- Leaflet / React-Leaflet (para mapas)
- QRCode.react (para generación de códigos QR)
- Axios (para peticiones HTTP)
- Vite (como bundler)

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Backend corriendo en `http://localhost:3000`

## Instalación

1. Navegar a la carpeta del frontend:
```bash
cd Frontend
```

2. Instalar dependencias:
```bash
npm install
```

## Ejecutar en Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
Frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Páginas de la aplicación
│   │   ├── auth/           # Login y Registro
│   │   ├── Evento/         # Listado, detalle, crear y editar eventos
│   │   ├── Participante/   # Mis inscripciones
│   │   ├── Organizador/    # Gestión de eventos y comprobantes
│   │   ├── Validador/      # Validación de QR
│   │   └── Admin/          # Gestión de usuarios
│   ├── services/           # Servicios para comunicación con API
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilidades (manejo de tokens)
│   ├── App.jsx
│   └── main.jsx
├── hooks/
│   └── useAuthentication.jsx
├── services/
│   ├── AuthService.js
│   ├── LugarService.js
│   ├── InscripcionService.js
│   └── UserService.js
└── utils/
    └── TokenUtilities.js
```

## Roles y Funcionalidades

### Visitante (Sin sesión)
- Ver listado de eventos futuros
- Ver detalles de eventos
- Acceder a registro e inicio de sesión

### Participante (role: 'user')
- Todo lo anterior +
- Inscribirse a eventos
- Ver mis inscripciones
- Generar y ver códigos QR
- Subir comprobantes de pago
- Cancelar inscripciones

### Organizador (role: 'organizador')
- Crear eventos con ubicación en mapa
- Editar y eliminar eventos propios
- Ver lista de inscritos
- Descargar lista de inscritos en CSV
- Verificar comprobantes de pago
- Ver estadísticas de eventos

### Validador (role: 'validador')
- Escanear y validar códigos QR
- Ver información del participante
- Registrar ingresos

### Administrador (role: 'admin')
- Gestión completa de usuarios
- Crear usuarios con diferentes roles
- Editar y eliminar usuarios
- Cambiar contraseñas y roles

## Rutas Principales

- `/` - Listado público de eventos
- `/eventos/:id` - Detalle de evento
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/participante/mis-inscripciones` - Mis inscripciones (Participante)
- `/organizador/eventos` - Mis eventos (Organizador)
- `/organizador/eventos/crear` - Crear evento (Organizador)
- `/organizador/eventos/editar/:id` - Editar evento (Organizador)
- `/organizador/comprobantes/:eventoId` - Verificar comprobantes (Organizador)
- `/validador` - Panel validador
- `/validador/validar/:token` - Validar QR
- `/admin/usuarios` - Gestión de usuarios (Admin)

## Variables de Entorno

El API_URL está configurado en cada servicio apuntando a `http://localhost:3000`. 
Si necesitas cambiarlo, modifica la constante `API_URL` en cada archivo de servicio.

## Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Características Destacadas

### Mapas Interactivos
- Selección de ubicación con clic en el mapa al crear/editar eventos
- Visualización de ubicación del evento en el detalle

### Códigos QR
- Generación automática de QR al inscribirse
- QR contiene URL directa a validación con token único
- Validación en tiempo real

### Sistema de Roles
- Rutas protegidas según rol de usuario
- Redirección automática según privilegios
- Navegación dinámica en el header

### Gestión de Comprobantes
- Subida de imágenes para comprobantes de pago
- Verificación por parte del organizador
- Estados: Pendiente, Verificado, Rechazado

## Notas Importantes

1. El backend debe estar corriendo antes de iniciar el frontend
2. Los tokens de autenticación se almacenan en localStorage
3. Las imágenes de eventos y comprobantes se sirven desde el backend
4. Los mapas requieren conexión a internet (usa OpenStreetMap)
5. El sistema usa JWT para autenticación

## Solución de Problemas

### Error de CORS
Asegúrate de que el backend tiene configurado CORS para permitir peticiones desde el frontend.

### Mapas no cargan
Verifica tu conexión a internet y que el link CSS de Leaflet esté en el index.html

### Error 401 en peticiones
El token JWT puede haber expirado. Cierra sesión e inicia nuevamente.

## Autor

José - Proyecto Final Ingeniería Web II

