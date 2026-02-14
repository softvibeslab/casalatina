import { useEffect, useState } from 'react';
import { Trophy, Calendar, Users, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Tournament, MemberLevel } from '../types';

export function Tournaments() {
  const [tournaments, setTournaments] = useState<(Tournament & { member_levels?: MemberLevel })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          member_levels (*)
        `)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      upcoming: 'Próximamente',
      active: 'En Curso',
      completed: 'Finalizado',
    };
    return labels[status as keyof typeof labels];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage: 'url(/torneo.png)',
        }}
      />
      <div className="absolute inset-0 bg-white/90" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-orange-600 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Torneos
          </h2>
        <p className="text-lg text-gray-600">
          Compite con los mejores jugadores del club
        </p>
      </div>

      {tournaments.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No hay torneos disponibles</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold flex-1">
                    {tournament.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      tournament.status
                    )}`}
                  >
                    {getStatusLabel(tournament.status)}
                  </span>
                </div>

                {tournament.description && (
                  <p className="text-white/90 mb-3">
                    {tournament.description}
                  </p>
                )}

                {tournament.member_levels && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/80">Nivel requerido:</span>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: tournament.member_levels.color,
                        color: 'white'
                      }}
                    >
                      {tournament.member_levels.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Inicio</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(tournament.start_date)}
                    </p>
                  </div>
                </div>

                {tournament.end_date && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Fin</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(tournament.end_date)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Participantes Máximos</p>
                    <p className="font-semibold text-gray-800">
                      {tournament.max_participants} jugadores
                    </p>
                  </div>
                </div>

                {tournament.status === 'upcoming' && (
                  <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all">
                    Inscribirse
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
