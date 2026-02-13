# Configuración del Administrador

## Crear el primer usuario administrador

Para crear el primer usuario administrador, sigue estos pasos:

### 1. Crear la cuenta
1. Ve a la aplicación y haz clic en "Iniciar Sesión"
2. Selecciona "¿No tienes cuenta? Regístrate"
3. Completa el formulario con:
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)
4. Haz clic en "Crear Cuenta"

### 2. Convertir el usuario en administrador

Una vez creada la cuenta, necesitas actualizar el rol en la base de datos:

**Opción A: Usando el panel de Supabase**
1. Ve a tu proyecto de Supabase
2. Navega a "Table Editor"
3. Selecciona la tabla `profiles`
4. Encuentra tu usuario recién creado
5. Edita el campo `role` y cámbialo de `guest` a `admin`
6. Guarda los cambios

**Opción B: Usando SQL**
Ejecuta este query en el SQL Editor de Supabase:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'tu-email@ejemplo.com';
```

### 3. Acceder al panel de administración

1. Recarga la página
2. Ahora verás un botón "Admin" en la barra de navegación
3. Haz clic para acceder al panel de administración

## Funciones del administrador

Como administrador, puedes:

- **Gestionar Eventos**: Crear, editar y eliminar eventos del club
- **Gestionar Torneos**: Crear y administrar torneos
- **Gestionar Miembros**: Ver y actualizar el estado de los miembros (activo, inactivo, pendiente)
- **Ver Estadísticas**: Acceso completo a todas las estadísticas del club

## Características de la aplicación

### Para usuarios no registrados
- Ver eventos próximos
- Ver tabla de clasificación
- Ver torneos disponibles
- Crear cuenta

### Para miembros registrados
- Todas las funciones de usuarios no registrados
- Registrarse como miembro del club
- Participar en torneos
- Ver su perfil y estadísticas

### Para administradores
- Todas las funciones de miembros
- Gestión completa de eventos
- Gestión completa de torneos
- Administración de miembros
- Control total del club

## Estructura de la base de datos

La aplicación incluye las siguientes tablas:

- **profiles**: Perfiles de usuario con roles (admin, member, guest)
- **members**: Información de membresía del club
- **events**: Eventos programados
- **tournaments**: Torneos del club
- **players**: Estadísticas de jugadores
- **matches**: Registro de partidos
- **tournament_participants**: Participantes en torneos

## Seguridad

- Autenticación mediante Supabase Auth
- Row Level Security (RLS) habilitado en todas las tablas
- Los usuarios solo pueden ver y editar sus propios datos
- Solo los administradores pueden crear eventos y torneos
- Acceso público de lectura para eventos, torneos y clasificaciones
