-- ============================================================================
-- Autor: Claude Code Assistant
-- Fecha: 2026-02-13
-- Descripción: Agrega campos de requisitos de nivel y control de cupos a events y tournaments
-- Orden: 6
-- ============================================================================

-- Actualizar tabla de eventos
ALTER TABLE events ADD COLUMN IF NOT EXISTS min_level_id uuid REFERENCES member_levels(id) ON DELETE SET NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants integer;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_enabled boolean DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS current_participants integer DEFAULT 0;

-- Actualizar tabla de torneos
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS min_level_id uuid REFERENCES member_levels(id) ON DELETE SET NULL;

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS events_min_level_idx ON events (min_level_id);
CREATE INDEX IF NOT EXISTS tournaments_min_level_idx ON tournaments (min_level_id);
