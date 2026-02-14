# 🚀 Guía de Deployment en Supabase - Sistema de 3 Roles

Este documento contiene **todas las migraciones SQL y el paso a paso** para implementar el sistema completo de 3 roles (Admin, Líder, Miembro) en Supabase.

---

## 📋 Tabla de Contenidos

1. [Preparación](#paso-1-preparativos)
2. [Crear Proyecto](#paso-2-crear-proyecto)
3. [Ejecutar Migraciones](#paso-3-ejecutar-migraciones)
4. [Conectar App Local](#paso-4-conectar-app)
5. [Verificar Funcionamiento](#paso-5-verificar)
6. [Solución de Problemas](#solucion-de-problemas)

---

## Paso 1: Preparativos ✅

### Requisitos Previos
- [ ] Cuenta activa en [Supabase](https://supabase.com)
- [ ] Proyecto Vite + React existente listo
- [ ] Las 8 migraciones SQL creadas en `supabase/migrations/`

### Checklist
- [x] Tener a mano el URL del proyecto en Supabase (dashboard → Settings → API)
- [x] Localizar las 8 migraciones SQL
- [x] Copia de seguridad: copiar `anon/public` key del proyecto

---

## Paso 2: Crear el Proyecto en Supabase 🆕

**¡Opción 1 seleccionada: Archivo Maestro (todo junto)** ✅

### Pasos Detallados:

1. **Ir a [Supabase Dashboard](https://supabase.com/dashboard)**
   - Clic en: **"New Project"**

2. **Configurar el Proyecto:**
   - **Project name**: `casa-latina-ping-pong` (o el que prefieras)
   - **Database Password**: La que configuraste al crear el proyecto
   - **Organization**: Free tier (recomendado para comenzar)
   - **Region**: Mexico (o la más cercana a Chiapas)

3. **Clic en "Create"** → Creará el proyecto nuevo

### Siguiente Paso: 🔧
**Ir a SQL Editor para ejecutar migraciones**
- El nuevo proyecto aparecerá en tu dashboard
- Ve a: **SQL Editor** ( Table Editor)
- Verás el nuevo proyecto creado
- Copia el contenido del archivo `001_master_migration.sql`
- En el editor, cambia el nombre de la query a `001_master_migration`
- Click "▶️ Run" o "Save & Run"

**Luego continuar con las siguientes migraciones** (001-008 hasta 008_seed_initial_data.sql):
- Cada archivo se ejecutará en orden secuencial
- El sistema procesará cada una automáticamente
- Verifica que cada una se ejecute correctamente antes de continuar

**Opción A: Ejecutar todas las migraciones en orden (RECOMENDADO)**
- Abre SQL Editor en tu dashboard de Supabase
- Ejecuta las 8 migraciones secuencialmente
- Ventaja: Todo el proceso se ejecuta automáticamente

**Opción B: Ejecutar migraciones individualmente (FLEXIBLE)**
- Abre SQL Editor en tu dashboard de Supabase
- Ejecuta cada archivo por separado
- Ventaja: Mayor control si alguna migración falla

### 2.1 Ejecutar las Migraciones en SQL Editor 🔧

**Opción A: Ejecutar todas las migraciones en orden (RECOMENDADO) ✅**
- Abre SQL Editor en tu dashboard de Supabase
- Clic en "New Project"
- Crea un nuevo proyecto
- Copia el nombre: `casa-latina-ping-pong`
- Selecciona organización: Free tier
- Selecciona región: Mexico
- Clic en "Create"

2. **Ejecuta las migraciones**
- Ve a SQL Editor
- Clic en "▶️ Run" (o el botón de play)
- Espera confirmación
- Siguiente migración automáticamente

**IMPORTANTE:** Las migraciones se ejecutan en orden automático (de la 1 a la 8) ⚠️
- El sistema ejecutará las migraciones en secuencia automática
- NO necesitas ejecutarlas manualmente
- Solo asegúrate de ejecutarlas en el orden correcto (1 → 8)

### 2.2 Opción B: Ejecutar Migraciones Individualmente 🔧

**¿Prefieres mayor control?**
- Sí, ejecuta cada migración por separado
- Ventaja: Si alguna falla, solo afecta a esa migración
- Te permite ver el resultado de cada una antes de continuar
- Ideal para debugging o cuando necesitas hacer cambios

**Pasos:**
1. Ve a SQL Editor en tu dashboard de Supabase
2. Haz clic en "New Project"
3. Para cada archivo de migración (001-008):
   - Copia el contenido completo del archivo
   - Pégalo en el editor
   - En el nombre de la query cambia `001_master_migration.sql`
   - Click "Run" (▶️) o "Save & Run"
4. Repite con los siguientes archivos
5. Espera a que se ejecute cada una antes de continuar

**Nota:** Esta opción da más flexibilidad si necesitas hacer cambios específicos o depurar problemas.

**Opción A: Ejecutar todas las migraciones en orden (RECOMENDADO) ✅**
- Abre SQL Editor en tu dashboard de Supabase
- Clic en "New Project"
- Crea un nuevo proyecto
- Copia el nombre: `casa-latina-ping-pong`
- Selecciona organización: Free tier
- Selecciona región: Mexico
- Clic en "Create"

2. **Ejecuta las migraciones**
- Ve a SQL Editor
- Clic en "▶️ Run" (o el botón de play)
- Espera confirmación
- Siguiente migración automáticamente

**IMPORTANTE:** Las migraciones se ejecutan en orden automático (de la 1 a la 8) ⚠️
- El sistema ejecutará las migraciones en secuencia automática
- NO necesitas ejecutarlas manualmente
- Solo asegúrate de ejecutarlas en el orden correcto (1 → 8)

### 2.1 Iniciar Nuevo Proyecto
1. **Ir a [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Clic en "New Project"**
3. **Configuración básica:**
   ```
   Nombre del proyecto: casa-latina-ping-pong
   - Database Password: (la que configures al crear el proyecto)
   - Organización: Free tier está bien (recomendado)
   - Región: Choose closest to your users (Mexico para ping menor latency)
   ```
4. **Clic en "Create new project"**

### 2.2 Orden de Ejecución de Migraciones

**⚠️ ORDEN CRÍTICO - Ejecutar en este orden exacto:**

Las migraciones se deben ejecutar **estrictamente en este orden** para evitar errores:

1. ✅ **001_add_extended_role.sql** (PRIMERO)
   - Agrega campo `extended_role` a tabla `profiles`
   - Crea índice para rendimiento

2. ✅ **008_seed_initial_data.sql** (SEGUNDO - ANTES de crear tablas)
   - Crea las 4 tablas base: `member_levels`, `achievements`, `member_achievements`, `club_info`
   - Inserta niveles iniciales: Principiante, Intermedio, Avanzado, Elite
   - Inserta logros de ejemplo: Primera Victoria, Campeón, Social
   - Inserta info del club inicial

3. ✅ **002_create_club_info.sql**
   - Tabla para información del negocio (solo admin puede editar)

4. ✅ **005_create_notifications.sql**
   - Sistema de notificaciones (registro, aprobación, rechazo, logros)

5. ✅ **004_create_registrations.sql**
   - Sistema unificado de inscripciones a eventos/torneos

6. ✅ **006_update_events_tournaments.sql**
   - Agrega campos de requisitos de nivel, cupos, etc.

7. ✅ **007_update_rls_policies.sql**
   - Actualiza políticas para permitir acceso a admin + líder

**⚠️ IMPORTANTE:** No saltar ninguna migración. El orden ES CRÍTICO para que la base de datos quede consistente.

---

## Paso 3: Ejecutar las Migraciones en SQL Editor 🔧

### 3.1 Ejecutar Cada Migración

Para cada archivo de migración:

1. **Abre el SQL Editor** en tu dashboard de Supabase
2. **Crea una nueva query** → Click "+ New" → SQL Editor
3. **Pega el código** de la migración
4. **Selecciona "Run" (▶️) en la toolbar
5. **Verifica ejecución**
   - Debe aparecerá "Successfully executed" en verde
   - Si hay error, copia el mensaje y verifica la sintaxis

**Lista de Migraciones a Ejecutar:**

| # | Archivo | Descripción | Campo que Afecta |
|---|---|---|---|
| 1 | `001_add_extended_role.sql` | `extended_role` en profiles | **PRIMERO** |
| 2 | `008_seed_initial_data.sql` | Crea tablas base | **SEGUNDO** |
| 3 | `002_create_club_info.sql` | Tabla club_info | **TERCERO** |
| 4 | `005_create_notifications.sql` | Tabla notifications | **CUARTO** |
| 5 | `004_create_registrations.sql` | Tabla registrations | **QUINTO** |
| 6 | `006_update_events_tournaments.sql` | Actualiza events/tournaments | **SEXTO** |
| 7 | `007_update_rls_policies.sql` | Políticas RLS | **SÉPTIMO** |

### 3.2 Verificar Tablas Creadas

Después de ejecutar `008_seed_initial_data.sql`, verifica en tu dashboard:

1. **Table Editor** → Deberías ver 6 tablas nuevas:
   - `member_levels` - 4 niveles con colores
   - `achievements` - Logros con iconos y XP
   - `member_achievements` - Tabla de unión
   - `club_info` - Información del negocio (solo 1 registro)
   - `registrations` - Inscripciones unificadas
   - `notifications` - Sistema de alertas

2. **Database Visualizer**
   - Ve a: Database → Tables
   - Explora las nuevas tablas para verificar que se crearon correctamente

---

## Paso 4: Conectar tu App Local a Supabase 🔗

### 4.1 Obtener Credenciales de Supabase

En tu dashboard de Supabase:
1. **Ve a: Project Settings → API**
2. **Copia el: Project URL** (ej: `https://xxxxx.supabase.co`)
3. **Copia el: anon/public key** → Click "Reveal" en la sección API
4. **Guarda ambas** para usar en tu proyecto local

### 4.2 Actualizar Archivo .env Local

Crea o actualiza `/Users/rgarciavital/casalatina/casalatina/.env.local`:

```bash
# Copia estas variables desde tu dashboard de Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4.3 Probar Conexión

1. **Reinicia servidor:**
   ```bash
   npm run dev
   # O
   Ctrl+C
   ```

2. **Verifica en el navegador:**
   - Abre http://localhost:5173
   - Inicia sesión
   - Verifica que ves:
     - [ ] Niveles en leaderboard
     - [ ] Sistema de inscripciones
     - [ ] Perfil de miembro con XP
     - [ ] Notificaciones con badge

---

## Paso 5: Verificar Funcionamiento ✅

### 5.1 Checklist de Funcionalidades

Una vez conectado, verifica que TODO funciona:

**Sistema de 3 Roles:**
- [ ] Admin puede editar: nombre del club, niveles, logros
- [ ] Líder puede gestionar: eventos, torneos, rankings, inscripciones
- [ ] Miembro puede: ver perfil, inscribirse a eventos/torneos si cumple requisitos
- [ ] Notificaciones funcionan con dropdown
- [ ] XP y niveles se calculan correctamente

**Frontend:**
- [ ] Hero con título del club
- [ ] Location con dirección
- [ ] Leaderboard muestra niveles de jugadores
- [ ] EventsList muestra requisitos de nivel
- [ ] Navbar tiene links a perfil e inscripciones
- [ ] App.tsx tiene rutas correctas

---

## 🔧 Solución de Problemas

### Errores Comunes

| Problema | Solución |
|---|---|---|
| **Error: "relation 'members' does not exist"** | Ejecuta `008_seed_initial_data.sql` PRIMERO para crear tablas |
| **Error: "extended_role" does not exist"** | La migración `001_add_extended_role.sql` crea este campo |
| **Error: "club_info does not exist"** | La migración `002_create_club_info.sql` crea esta tabla |
| **Build falla con comillas simples** | Revisa componentes que usen `'` en vez de `"` |
| **Error: "duplicate key value"** | Revisa que no haya claves duplicadas en `.env.local` |
| **RLS policy errors** | Las migraciones `007_update_rls_policies.sql` tienen las políticas correctas |

### Consejos de Solución

1. **Errores SQL:** Si una migración falla:
   - Clic en "..." en SQL Editor
   - Copia el error exacto
   - Google el error y aplica el fix
   - Ejecuta las migraciones en orden

2. **Errores de Frontend:** Si hay errores:
   - Revisa las comillas en JSX (usa `"` en vez de `'`)
   - Verifica que todos los imports estén correctos
   - Limpia cache: `rm -rf node_modules/.vite && npm run dev`

---

## 📝 Resumen Final

**Has completado:** ✅
- 8 migraciones SQL listas para deployment
- Documento paso a paso para implementar en Supabase
- Guía de troubleshooting incluida

**Siguiente paso:** 🚀
1. Crea el proyecto en Supabase siguiendo el Paso 2
2. Ejecuta las migraciones en el orden indicado (Paso 3)
3. Conecta tu app local siguiendo el Paso 4
4. ¡Disfruta del sistema de ping pong con 3 roles completado!

---

¿Necesitas algo más antes de empezar? ¿O prefieres que te explique algún paso en mayor detalle? 🤔
