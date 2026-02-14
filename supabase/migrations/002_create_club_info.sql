-- ============================================================================
-- Autor: Claude Code Assistant
-- Fecha: 2026-02-13
-- Descripción: Crea tabla club_info para información del negocio
-- Orden: 2
-- ============================================================================

CREATE TABLE IF NOT EXISTS club_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Política RLS: Público puede leer
CREATE POLICY "Club info viewable by everyone"
ON club_info FOR SELECT
USING (true);

-- Política RLS: Solo admin puede editar
CREATE POLICY "Admins can manage club info"
ON club_info FOR ALL
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE extended_role = 'admin')
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE extended_role = 'admin')
);

-- Insertar información inicial del club
INSERT INTO club_info (key, value) VALUES
  ('description', '{"es": "Casa Latina Ping Pong Club es un espacio inclusivo en San Cristóbal de las Casas, Chiapas, donde jugadores de todos los niveles pueden disfrutar del ping pong, participar en torneos, y ser parte de una vibrante comunidad que une el deporte, la música y el arte."}'),
  ('schedule', '{"es": {"weekdays": ["martes", "miércoles", "jueves"], "time": "18:00 - 21:00"}'),
  ('contact', '{"es": {"phone": "+52 555 1234", "whatsapp": "https://wa.me/52xxxxxxxxx", "email": "info@casalatina.com"}'),
  ('pricing', '{"es": {"mensual": "$500", "anual": "$5000"}');
