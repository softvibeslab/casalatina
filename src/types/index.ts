export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'member' | 'guest';
  created_at: string;
}

export interface Member {
  id: string;
  user_id: string;
  phone: string | null;
  membership_status: 'active' | 'inactive' | 'pending';
  joined_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: 'training' | 'tournament' | 'social' | 'documentary' | 'other';
  location: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: 'upcoming' | 'active' | 'completed';
  max_participants: number;
  created_by: string | null;
  created_at: string;
}

export interface Player {
  id: string;
  user_id: string;
  ranking_points: number;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  win_rate: number;
  updated_at: string;
  profiles?: Profile;
}

export interface Match {
  id: string;
  tournament_id: string | null;
  player1_id: string;
  player2_id: string;
  player1_score: number;
  player2_score: number;
  winner_id: string | null;
  match_date: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  created_at: string;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  player_id: string;
  seed: number | null;
  status: 'registered' | 'active' | 'eliminated' | 'winner';
  registered_at: string;
}
