import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Player } from '../types';

export function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('ranking_points', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <Trophy className="h-16 w-16 text-orange-600 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Tabla de Clasificación
        </h2>
        <p className="text-lg text-gray-600">
          Los mejores jugadores del club
        </p>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Aún no hay jugadores registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Posición</th>
                  <th className="px-6 py-4 text-left font-semibold">Jugador</th>
                  <th className="px-6 py-4 text-center font-semibold">Puntos</th>
                  <th className="px-6 py-4 text-center font-semibold">Partidos</th>
                  <th className="px-6 py-4 text-center font-semibold">Ganados</th>
                  <th className="px-6 py-4 text-center font-semibold">% Victoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {players.map((player, index) => {
                  const medal = getMedalIcon(index + 1);
                  return (
                    <tr
                      key={player.id}
                      className={`hover:bg-orange-50 transition-colors ${
                        index < 3 ? 'bg-orange-50/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {medal ? (
                            <span className="text-2xl">{medal}</span>
                          ) : (
                            <span className="text-lg font-semibold text-gray-600">
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">
                          {player.profiles?.full_name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          <span className="font-bold text-orange-600">
                            {player.ranking_points}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700">
                        {player.matches_played}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700">
                        {player.matches_won}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          {(player.win_rate * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
