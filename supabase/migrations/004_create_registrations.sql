-- ============================================================================
-- Autor: Claude Code Assistant
-- Fecha: 2026-02-13
-- Descripción: Crea sistema unificado de inscripciones a eventos y torneos
-- Orden: 4
-- ============================================================================

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('event', 'tournament')),
  target_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  registered_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  notes text,
  UNIQUE (user_id, target_type, target_id)
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS registrations_target_idx ON registrations (target_type, target_id);
CREATE INDEX IF NOT EXISTS registrations_user_idx ON registrations (user_id);
CREATE INDEX IF NOT EXISTS registrations_status_idx ON registrations (status);

-- Política RLS: Usuarios pueden ver inscripciones
CREATE POLICY "Registrations viewable by everyone"
ON registrations FOR SELECT
USING (true);

-- Política RLS: Usuarios pueden crear sus inscripciones
CREATE POLICY "Users can register themselves"
ON registrations FOR INSERT
WITH CHECK (
  auth.uid() = user_id
);

-- Política RLS: Admin y líder pueden gestionar inscripciones
CREATE POLICY "Admins and leaders can manage registrations"
ON registrations FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE extended_role IN ('admin', 'leader')
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE extended_role IN ('admin', 'leader')
  )
);
