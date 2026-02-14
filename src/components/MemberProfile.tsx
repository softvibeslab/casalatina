import { useEffect, useState } from 'react';
import { Trophy, Target, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Member, MemberAchievement, Player } from '../types';

export function MemberProfile() {
  const { profile } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [achievements, setAchievements] = useState<MemberAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadMemberData();
    }
  }, [profile]);

  const loadMemberData = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      // Load member data
      const { data: memberData } = await supabase
        .from('members')
        .select(`
          *,
          member_levels (*)
        `)
        .eq('user_id', profile.id)
        .maybeSingle();

      setMember(memberData || null);

      // Load player data
      const { data: playerData } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      setPlayer(playerData || null);

      // Load achievements
      const { data: achievementsData } = await supabase
        .from('member_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('user_id', profile.id)
        .order('earned_at', { ascending: false });

      setAchievements(achievementsData || []);
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Perfil no encontrado</h2>
        <p className="text-gray-600">
          No tienes un perfil de miembro.{" "}
          <a href="#" onClick={() => window.location.reload()} className="text-orange-600 hover:underline">
            Regístrate como miembro
          </a>
        </p>
      </div>
    );
  }

  const level = member.member_levels;
  const xpToNextLevel = level ? level.min_xp - (member.xp_total || 0) : 0;
  const xpPercentage = level && level.min_xp > 0 ? (member.xp_total || 0) / level.min_xp * 100 : 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header with Level Badge */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ backgroundColor: level?.color || "#6B7280" }}
              >
                {level?.level_number || 1}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                {level?.name || "Principiante"}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {profile?.full_name}
              </h1>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Nivel Actual</div>
            <div className="text-2xl font-bold" style={{ color: level?.color || "#6B7280" }}>
              {level?.name || "Principiante"}
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        {level && (
          <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                XP Total: <span className="text-orange-600 font-bold">{member.xp_total || 0}</span>
              </span>
              <span className="text-sm text-gray-500">
                Siguiente nivel: {xpToNextLevel} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(xpPercentage, 100)}%`,
                  backgroundColor: level?.color || "#6B7280"
                }}
              />
            </div>
          </div>
          </>
        )}

        {/* Member Info */}
      </div>

      {/* Player Stats */}
      {player && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-orange-600" />
            Estadísticas de Juego
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 text-center">
              <div className="text-sm text-gray-600 mb-1">Partidos</div>
              <div className="text-3xl font-bold text-gray-800">{player.matches_played || 0}</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
              <div className="text-sm text-gray-600 mb-1">Ganados</div>
              <div className="text-3xl font-bold text-green-600">{player.matches_won || 0}</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 text-center">
              <div className="text-sm text-gray-600 mb-1">Perdidos</div>
              <div className="text-3xl font-bold text-red-600">{player.matches_lost || 0}</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
              <div className="text-sm text-gray-600 mb-1">% Victoria</div>
              <div className="text-3xl font-bold text-blue-600">
                {((player.win_rate || 0) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-gray-600">Puntos de Ranking</span>
            <span className="text-3xl font-bold text-orange-600">
              {player.ranking_points || 1000}
            </span>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Award className="h-6 w-6 mr-2 text-orange-600" />
          Logros Obtenidos ({achievements.length})
        </h2>

        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aún no has obtenido logros</p>
            <p className="text-sm text-gray-500 mt-2">
              Participa en eventos y torneos para ganar logros y XP
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ma) => (
              <div
                key={ma.id}
                className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{ma.achievement?.icon || "🏆"}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">
                      {ma.achievement?.name}
                    </h3>
                    {ma.achievement?.description && (
                      <p className="text-sm text-gray-600">
                        {ma.achievement.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full"
                            style={{ backgroundColor: level?.color || "#6B7280", color: "white" }}>
                        +{ma.achievement?.xp_reward || 0} XP
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Obtenido: {new Date(ma.earned_at).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
