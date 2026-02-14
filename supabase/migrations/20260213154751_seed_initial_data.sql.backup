/*
  # Seed Initial Data

  ## Overview
  Adds sample events and tournaments to showcase the club's activities.

  ## Changes
  1. Sample Events
    - Weekly training sessions
    - Documentary projection event
    - Special inauguration event
  
  2. Sample Tournament
    - Inaugural tournament for the club opening

  ## Notes
  - Events are created without a specific user (created_by is NULL)
  - Dates are set relative to current time for demonstration
  - These are example data to make the site look active
*/

-- Insert sample events
INSERT INTO events (title, description, event_date, event_type, location) VALUES
  ('Entreno y Retas', 'Sesión de entrenamiento y partidos amistosos. Todos los niveles bienvenidos.', NOW() + INTERVAL '2 days' + INTERVAL '17 hours', 'training', 'Casa Latina, San Cristóbal'),
  ('Proyección Documental: Los Mirlos', 'Noche de cine con documental sobre cultura de ping pong. Incluye palomitas y discusión.', NOW() + INTERVAL '4 days' + INTERVAL '19 hours', 'documentary', 'Casa Latina, San Cristóbal'),
  ('Entreno y Retas', 'Sesión de entrenamiento y partidos amistosos. Todos los niveles bienvenidos.', NOW() + INTERVAL '5 days' + INTERVAL '17 hours', 'training', 'Casa Latina, San Cristóbal'),
  ('Inauguración Oficial', 'Gran inauguración del club con torneo especial, música en vivo y comida. ¡Todos invitados!', NOW() + INTERVAL '7 days' + INTERVAL '17 hours', 'social', 'Casa Latina, San Cristóbal'),
  ('Entreno Técnico Avanzado', 'Sesión especial de técnica para jugadores intermedios y avanzados.', NOW() + INTERVAL '9 days' + INTERVAL '18 hours', 'training', 'Casa Latina, San Cristóbal'),
  ('Torneo Mensual', 'Torneo clasificatorio para la tabla de posiciones del mes.', NOW() + INTERVAL '14 days' + INTERVAL '16 hours', 'tournament', 'Casa Latina, San Cristóbal')
ON CONFLICT DO NOTHING;

-- Insert sample tournaments
INSERT INTO tournaments (name, description, start_date, end_date, status, max_participants) VALUES
  ('Torneo Inaugural Casa Latina', 'Primer torneo oficial del club. Categoría abierta para todos los niveles. Premios para los 3 primeros lugares.', NOW() + INTERVAL '7 days' + INTERVAL '17 hours', NOW() + INTERVAL '7 days' + INTERVAL '22 hours', 'upcoming', 16),
  ('Copa San Cristóbal 2026', 'Torneo regional con participación de clubes de toda la región. Categorías: Principiantes, Intermedios y Avanzados.', NOW() + INTERVAL '30 days', NOW() + INTERVAL '32 days', 'upcoming', 32)
ON CONFLICT DO NOTHING;
