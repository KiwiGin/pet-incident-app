# Pet Incident App

App de gestión de incidentes de mascotas construida con React Native, Expo y TypeScript.

## Stack Tecnológico

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma de desarrollo
- **TypeScript**: Tipado estático
- **Expo Router**: Navegación basada en archivos
- **Context API**: Manejo de estado global

## Estructura del Proyecto

```
pet-incident-app/
├── app/                      # Pantallas de la aplicación (Expo Router)
│   ├── (tabs)/              # Pantallas con tabs
│   ├── login.tsx            # Pantalla de login
│   ├── signup.tsx           # Pantalla de registro
│   └── _layout.tsx          # Layout principal
├── components/              # Componentes reutilizables
│   ├── InputBasic/          # Input personalizado
│   ├── ButtonBasic/         # Botón personalizado
│   └── TextBasic/           # Texto personalizado
├── contexts/                # Contextos de React
│   └── AuthContext.tsx      # Contexto de autenticación
├── screens/                 # Pantallas de la app
│   ├── Login/               # Pantalla de login
│   └── Signup/              # Pantalla de registro
├── services/                # Servicios y API
│   └── auth.service.ts      # Servicio de autenticación (con mocks)
├── types/                   # Tipos de TypeScript
│   └── index.ts             # Tipos compartidos
└── assets/                  # Recursos (imágenes, fuentes, etc.)
```

## Características Implementadas

### Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios
- Logout
- Validación de formularios
- Manejo de errores

### Componentes Base
- **InputBasic**: Input con soporte para contraseñas (con toggle de visibilidad)
- **ButtonBasic**: Botón con variantes (primary, secondary, ghost) y estados de carga
- **TextBasic**: Texto con diferentes variantes (title, subtitle, body, caption)

### Navegación
- Navegación basada en archivos con Expo Router
- Protección de rutas basada en autenticación
- Redirección automática según estado de login

## Datos Mock

Por el momento, la app usa datos mock para simular la autenticación. El servicio en `services/auth.service.ts` simula:
- Delay de red (1000ms para login/signup, 500ms para logout)
- Validación de credenciales
- Almacenamiento en memoria de usuarios registrados

### Usuario de prueba:
- Email: `demo@example.com`
- Password: `password123`

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

## Próximos Pasos (Backend Integration)

Cuando el backend esté listo, necesitarás actualizar:

1. **`services/auth.service.ts`**: Reemplazar las funciones mock con llamadas HTTP reales
2. **Token Storage**: Implementar almacenamiento seguro de tokens (AsyncStorage o SecureStore)
3. **Interceptores**: Agregar interceptores para manejar tokens en las peticiones
4. **Refresh Tokens**: Implementar renovación automática de tokens

## Diseño

Figma: https://www.figma.com/design/1SnrJsRJDLB3neZYgFNYfp/Prototipos?node-id=202-2&p=f&t=3PJBca6loHXTlOEs-0
