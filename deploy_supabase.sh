#!/bin/bash
# Script para ejecutar migraciones de Supabase
# Este script ejecutará las migraciones en el orden correcto

set -e

PROJECT_REF="esagulzideopsklksjan"
SUPABASE_URL="https://esagulzideopsklksjan.supabase.co"

echo "🚀 Iniciando deployment a Supabase..."
echo "📁 Proyecto: $PROJECT_REF"
echo ""

# Opción 1: Usar Supabase CLI (RECOMENDADO)
echo "📝 Opción 1: Usar Supabase CLI"
echo "Ejecutando: supabase db push"
echo ""

# Primero, verificar que estamos logueados
supabase status > /dev/null 2>&1 || {
  echo "❌ No estás logueado en Supabase CLI"
  echo "Ejecuta: supabase login --token TU_TOKEN"
  exit 1
}

# Ejecutar push con confirmación automática
yes Y | supabase db push 2>&1 || {
  echo ""
  echo "❌ Error ejecutando migraciones"
  echo ""
  echo "📝 Opción 2: Ejecutar manualmente en el Dashboard"
  echo "1. Ve a: https://supabase.com/dashboard/project/$PROJECT_REF/sql"
  echo "2. Crea una nueva query"
  echo "3. Copia el contenido de: supabase/migrations/000_init_schema.sql"
  echo "4. Pégalo en el editor y haz clic en Run"
  echo "5. Luego repite con: supabase/migrations/001_master_migration.sql"
  exit 1
}

echo ""
echo "✅ Migraciones ejecutadas exitosamente!"
echo "🔗 Verifica las tablas en: https://supabase.com/dashboard/project/$PROJECT_REF/editor"
