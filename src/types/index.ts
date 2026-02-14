export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'member' | 'guest';  // Legacy, kept for compatibility
  extended_role: 'admin' | 'leader' | 'member' | 'guest';  // New 4-role system
  created_at: string;
}

export interface Member {
  id: string;
  user_id: string;
  phone: string | null;
  membership_status: 'active' | 'inactive' | 'pending';
  xp_total: number;  // Total experience points
  level_id: string | null;  // Current member level
  joined_at: string;
  updated_at: string;
  member_levels?: MemberLevel;  // Joined level data
  profiles?: Profile;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: 'training' | 'tournament' | 'social' | 'documentary' | 'other';
  location: string | null;
  flyer_url: string | null;
  min_level_id: string | null;  // Minimum member level required
  max_participants: number | null;  // Maximum participants (null = unlimited)
  registration_enabled: boolean;  // Whether registration is open
  current_participants: number;  // Current approved participants
  created_by: string | null;
  created_at: string;
  updated_at: string;
  member_levels?: MemberLevel;  // Joined level data
}

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: 'upcoming' | 'active' | 'completed';
  max_participants: number;
  min_level_id: string | null;  // Minimum member level required
  created_by: string | null;
  created_at: string;
  member_levels?: MemberLevel;  // Joined level data
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
  members?: Member & { member_levels?: MemberLevel };
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

// New types for the 3-role system

export interface ClubInfo {
  id: string;
  key: 'description' | 'schedule' | 'contact' | 'pricing';
  value: string;  // JSON content
  updated_at: string;
}

export interface MemberLevel {
  id: string;
  name: string;
  level_number: number;
  min_xp: number;
  benefits: any;  // JSON object
  color: string;  // Hex color for UI
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  xp_reward: number;
  icon: string | null;
  category: string | null;
  created_at: string;
}

export interface MemberAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;  // Joined achievement data
  profiles?: Profile;
}

export interface Registration {
  id: string;
  user_id: string;
  target_type: 'event' | 'tournament';
  target_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  registered_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
  profiles?: Profile;  // Joined user data
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'registration_approved' | 'registration_rejected' | 'achievement_earned' | 'level_up' | 'event_reminder';
  title: string;
  message: string;
  related_id: string | null;
  is_read: boolean;
  created_at: string;
}
