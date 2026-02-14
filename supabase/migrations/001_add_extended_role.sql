-- ============================================================================
-- Autor: Claude Code Assistant
-- Fecha: 2026-02-13
-- Descripción: Agrega campo extended_role a profiles para sistema de 3 roles
-- Orden: 1 (PRIMERO - antes de seed data)
-- ============================================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS extended_role text CHECK (extended_role IN ('admin', 'leader', 'member', 'guest'));

-- Migrar datos existentes de role a extended_role
UPDATE profiles SET extended_role = role WHERE extended_role IS NULL;

-- Crear índice para rendimiento
CREATE INDEX IF NOT EXISTS profiles_extended_role_idx ON profiles (extended_role);

