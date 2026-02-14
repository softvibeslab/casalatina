-- ============================================================================
-- Autor: Claude Code Assistant
-- Fecha: 2026-02-13
-- Descripción: Crea sistema de niveles, logros y tabla de logros de miembros
-- Orden: 3
-- ============================================================================

-- Tabla de niveles de membresía
CREATE TABLE IF NOT EXISTS member_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  level_number integer UNIQUE NOT NULL,
  min_xp integer DEFAULT 0 NOT NULL,
  benefits jsonb,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Política RLS: Público puede ver niveles
CREATE POLICY "Levels viewable by everyone"
ON member_levels FOR SELECT
USING (true);

-- Índice para rendimiento
CREATE INDEX IF NOT EXISTS member_levels_name_idx ON member_levels (name);
CREATE INDEX IF NOT EXISTS member_levels_level_number_idx ON member_levels (level_number);

-- Tabla de logros (achievements)
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  xp_reward integer DEFAULT 0 NOT NULL,
  icon text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Política RLS: Público puede ver logros
CREATE POLICY "Achievements viewable by everyone"
ON achievements FOR SELECT
USING (true);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS achievements_category_idx ON achievements (category);

-- Tabla de logros de miembros
CREATE TABLE IF NOT EXISTS member_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);

-- Política RLS: Público puede ver logros de miembros
CREATE POLICY "Member achievements viewable by everyone"
ON member_achievements FOR SELECT
USING (true);

-- Índice para rendimiento
CREATE INDEX IF NOT EXISTS member_achievements_user_idx ON member_achievements (user_id);
CREATE INDEX IF NOT EXISTS member_achievements_achievement_idx ON member_achievements (achievement_id);
