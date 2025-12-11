# Integración de Autenticación con Backend

## Resumen de Cambios

Se ha integrado completamente el sistema de autenticación con el backend de la API de Pet Incident. Los cambios incluyen:

### 1. Archivos Modificados

- **[services/auth.service.ts](services/auth.service.ts)** - Servicio de autenticación actualizado para conectar con la API real
- **[contexts/AuthContext.tsx](contexts/AuthContext.tsx)** - Context actualizado para manejar las respuestas de la API
- **[types/index.ts](types/index.ts)** - Tipos actualizados (agregado campo `phone` a `SignupData`)
- **[screens/Signup/Signup.tsx](screens/Signup/Signup.tsx)** - Formulario de registro actualizado con campo de teléfono

### 2. Archivos Creados

- **[constants/api.ts](constants/api.ts)** - Configuración centralizada de URLs de la API

### 3. Nuevas Dependencias

- **expo-secure-store** - Para almacenamiento seguro de tokens JWT

## Configuración de la API

### URLs por Plataforma

El archivo [constants/api.ts](constants/api.ts) configura automáticamente la URL correcta según la plataforma:

- **Android Emulator**: `http://10.0.2.2:5000/api`
- **iOS Simulator**: `http://localhost:5000/api`
- **Dispositivo Físico**: Debes cambiar a la IP de tu computadora (ej: `192.168.1.100`)

### Para usar en dispositivo físico:

1. Obtén la IP de tu computadora:
   - Windows: `ipconfig` en CMD
   - Mac/Linux: `ifconfig` en Terminal

2. Edita [constants/api.ts](constants/api.ts:12) y cambia la URL para Android:
   ```typescript
   if (Platform.OS === 'android') {
     return 'http://TU_IP_AQUI:5000/api'; // Ejemplo: http://192.168.1.100:5000/api
   }
   ```

## Funcionalidades Implementadas

### 1. Registro de Usuario (Signup)

**Endpoint**: `POST /api/auth/register`

**Campos**:
- Full Name (requerido)
- Email (requerido)
- Phone (opcional)
- Password (requerido, mínimo 6 caracteres)
- Confirm Password (requerido)

**Flujo**:
1. Usuario completa el formulario en [screens/Signup/Signup.tsx](screens/Signup/Signup.tsx)
2. Se validan los campos localmente
3. Se envía la petición al backend
4. Si es exitoso, se guarda el token JWT en SecureStore
5. Se actualiza el estado del usuario en AuthContext
6. Se redirige a las tabs principales

### 2. Login de Usuario

**Endpoint**: `POST /api/auth/login`

**Campos**:
- Email (requerido)
- Password (requerido)

**Flujo**:
1. Usuario ingresa credenciales en [screens/Login/Login.tsx](screens/Login/Login.tsx)
2. Se envía la petición al backend
3. Si es exitoso, se guarda el token JWT en SecureStore
4. Se actualiza el estado del usuario en AuthContext
5. Se redirige a las tabs principales

### 3. Persistencia de Sesión

**Endpoint**: `GET /api/auth/me`

**Flujo**:
1. Al iniciar la app, [AuthContext.tsx](contexts/AuthContext.tsx:16) verifica si hay un token guardado
2. Si existe token, hace una petición a `/auth/me` para obtener los datos del usuario
3. Si el token es válido, restaura la sesión automáticamente
4. Si el token es inválido o expiró, lo elimina y muestra el login

### 4. Logout

**Flujo**:
1. Usuario presiona logout
2. Se elimina el token de SecureStore
3. Se limpia el estado del usuario en AuthContext
4. Se redirige al login

## Almacenamiento Seguro

Los tokens JWT se almacenan de forma segura usando **expo-secure-store**, que utiliza:
- **iOS**: Keychain Services
- **Android**: EncryptedSharedPreferences (API 23+) o Android Keystore

**Clave de almacenamiento**: `auth_token`

## Manejo de Errores

El servicio de autenticación maneja los siguientes errores:

1. **Errores del servidor** (4xx, 5xx): Muestra el mensaje de error del backend
2. **Errores de red**: Muestra "Network error. Please check your connection."
3. **Token inválido/expirado**: Elimina el token y redirige al login

## Estructura de Respuestas de la API

### Respuesta de Login/Register:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6543abc123def456",
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": "+51987654321",
      "photoURL": "https://...",
      "createdAt": "2025-11-17T10:30:00.000Z",
      "updatedAt": "2025-11-17T10:30:00.000Z"
    }
  }
}
```

### Mapeo de Datos:

El backend usa `fullName`, pero la app internamente usa `name`:

```typescript
// Backend -> App
{
  fullName: "John Doe"  // Backend
}
→
{
  name: "John Doe"      // App
}
```

## Cómo Probar

### 1. Asegúrate de que el backend esté corriendo:

```bash
cd C:\Users\bayes\Desktop\Escritorio\Moviles\PetIncidentApp
docker-compose up
```

Verifica que esté corriendo en: `http://localhost:5000`

### 2. Inicia la app móvil:

```bash
cd c:\Users\bayes\Desktop\Escritorio\Moviles\pet-incident-app
npm start
```

### 3. Prueba el flujo completo:

1. **Registro**:
   - Abre la app
   - Toca "Signup"
   - Completa el formulario
   - Presiona "Sign up"
   - Deberías ser redirigido a las tabs

2. **Logout y Login**:
   - Haz logout desde la app
   - Ingresa las mismas credenciales
   - Presiona "Log in"
   - Deberías ver tus datos

3. **Persistencia**:
   - Cierra completamente la app
   - Vuelve a abrirla
   - Deberías estar automáticamente autenticado

## Próximos Pasos

Para completar la integración, puedes implementar:

1. **Servicio de Incidentes**: Crear `services/incidents.service.ts` para CRUD de incidentes
2. **Servicio de Usuarios**: Crear `services/users.service.ts` para actualizar perfil
3. **Interceptor de Tokens**: Crear un wrapper de fetch que agregue automáticamente el token
4. **Refresh Token**: Implementar renovación automática de tokens
5. **Forgot Password**: Conectar con el endpoint de recuperación de contraseña

## Debugging

### Ver el token almacenado:

Agrega este código temporal donde quieras verificar el token:

```typescript
import { authService } from '@/services/auth.service';

const token = await authService.getToken();
console.log('Current token:', token);
```

### Ver logs de red:

En el emulador/simulador, abre las DevTools de React Native para ver los logs de las peticiones fetch.

### Errores comunes:

1. **"Network error"** en Android Emulator:
   - Verifica que uses `10.0.2.2` en lugar de `localhost`

2. **"Network error"** en dispositivo físico:
   - Asegúrate de que el dispositivo esté en la misma red WiFi
   - Usa la IP de tu computadora en [constants/api.ts](constants/api.ts)

3. **Token inválido**:
   - Verifica que el backend esté corriendo
   - Verifica que la URL de la API sea correcta
   - Revisa los logs del backend
