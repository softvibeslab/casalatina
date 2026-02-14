-- ============================================================================
-- Autor: Claude Code Assistant
-- Fecha: 2026-02-13
-- Descripción: Crea sistema de notificaciones para usuarios
-- Orden: 5
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('registration_approved', 'registration_rejected', 'achievement_earned', 'level_up', 'event_reminder')),
  title text NOT NULL,
  message text NOT NULL,
  related_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (user_id);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON notifications (type);

-- Política RLS: Usuarios pueden ver notificaciones de otros
CREATE POLICY "Notifications viewable by everyone"
ON notifications FOR SELECT
USING (true);

-- Política RLS: Usuarios pueden marcar como leídas
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  is_read = true::boolean OR is_read = NULL::boolean
);

-- Política RLS: Admin puede ver todas las notificaciones (opcional)
CREATE POLICY "Admins can view all notifications"
ON notifications FOR SELECT
USING (true);
