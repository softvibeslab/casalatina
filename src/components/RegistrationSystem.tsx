import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Check, X, Trophy, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Event, Tournament, Registration, MemberLevel } from '../types';

export function RegistrationSystem() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'tournaments'>('events');
  const [events, setEvents] = useState<(Event & { member_levels?: MemberLevel })[]>([]);
  const [tournaments, setTournaments] = useState<(Tournament & { member_levels?: MemberLevel })[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile, activeTab]);

  const loadData = async () => {
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

      setMember(memberData);

      // Load available events/tournaments
      if (activeTab === 'events') {
        const { data: eventsData } = await supabase
          .from('events')
          .select(`
            *,
            member_levels (*)
          `)
          .gte('event_date', new Date().toISOString())
          .eq('registration_enabled', true)
          .order('event_date', { ascending: true });

        setEvents(eventsData || []);
      } else {
        const { data: tournamentsData } = await supabase
          .from('tournaments')
          .select(`
            *,
            member_levels (*)
          `)
          .in('status', ['upcoming', 'active'])
          .order('start_date', { ascending: true });

        setTournaments(tournamentsData || []);
      }

      // Load my registrations
      const { data: registrationsData } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', profile.id)
        .order('registered_at', { ascending: false });

      setMyRegistrations(registrationsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = (targetId: string, targetType: 'event' | 'tournament') => {
    return myRegistrations.some(
      r => r.target_id === targetId && r.target_type === targetType
    );
  };

  const canRegister = (minLevelId: string | null, memberLevelId: string | null) => {
    if (!minLevelId) return true; // No level requirement
    if (!memberLevelId) return false; // User has no level

    // Get level numbers
    const minLevel = events.find(e => e.min_level_id === minLevelId)?.member_levels ||
                      tournaments.find(t => t.min_level_id === minLevelId)?.member_levels;

    if (!minLevel) return true;

    const memberLevel = member?.member_levels;
    if (!memberLevel) return false;

    return memberLevel.level_number >= minLevel.level_number;
  };

  const checkCapacity = (maxParticipants: number | null, currentParticipants: number | null) => {
    if (!maxParticipants) return true;
    return (currentParticipants || 0) < maxParticipants;
  };

  const handleRegister = async (targetId: string, targetType: 'event' | 'tournament') => {
    if (!profile) {
      alert('Debes iniciar sesión para inscribirte');
      return;
    }

    // Check if already registered
    if (checkRegistrationStatus(targetId, targetType)) {
      alert('Ya estás inscrito en este evento/torneo');
      return;
    }

    const target = targetType === 'event'
      ? events.find(e => e.id === targetId)
      : tournaments.find(t => t.id === targetId);

    if (!target) return;

    // Check level requirement
    if (!canRegister(target.min_level_id || null, member?.level_id || null)) {
      alert(`Este ${targetType === "event" ? "evento" : "torneo"} requiere nivel ${target.member_levels?.name || "superior"}`);
      return;
    }

    // Check capacity
    if ('max_participants' in target && !checkCapacity(target.max_participants, target.current_participants)) {
      alert('Este evento/torneo está lleno');
      return;
    }

    try {
      const { error } = await supabase
        .from('registrations')
        .insert({
          user_id: profile.id,
          target_type: targetType,
          target_id: targetId,
          status: 'pending'
        });

      if (error) throw error;

      alert('Solicitud de inscripción enviada. Espera la aprobación del administrador.');
      loadData();
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error al enviar la inscripción');
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    if (!confirm('¿Estás seguro de cancelar esta inscripción?')) return;

    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: 'cancelled' })
        .eq('id', registrationId);

      if (error) throw error;

      alert('Inscripción cancelada');
      loadData();
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Error al cancelar la inscripción');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Sistema de Inscripciones
      </h1>

      {/* Level Info */}
      {member?.member_levels && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ backgroundColor: member.member_levels.color }}
            >
              {member.member_levels.level_number}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {member.member_levels.name}
              </h2>
              <p className="text-gray-600">
                XP Total: <span className="font-bold text-orange-600">{member.xp_total || 0}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 mb-8">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'events'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Eventos Disponibles
        </button>
        <button
          onClick={() => setActiveTab('tournaments')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'tournaments'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Torneos Disponibles
        </button>
        <button
          onClick={() => setActiveTab('my-registrations')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'my-registrations'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Mis Inscripciones
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Próximos Eventos
          </h2>

          {events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay eventos disponibles</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const isRegistered = checkRegistrationStatus(event.id, 'event');
                const canJoin = canRegister(event.min_level_id, member?.level_id);
                const hasCapacity = checkCapacity(event.max_participants, event.current_participants);

                return (
                  <div
                    key={event.id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
                      isRegistered
                        ? 'border-green-500'
                        : canJoin && hasCapacity
                        ? 'border-gray-200 hover:border-orange-500 hover:shadow-xl'
                        : 'border-gray-200 opacity-75'
                    }`}
                  >
                    {event.flyer_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.flyer_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        {isRegistered && (
                          <div className="absolute inset-0 bg-green-600/80 flex items-center justify-center">
                            <Check className="h-16 w-16 text-white" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex-1">
                          {event.title}
                        </h3>
                        {event.member_levels && (
                          <span
                            className="px-2 py-1 rounded-full text-xs font-semibold ml-2"
                            style={{ backgroundColor: event.member_levels.color, color: "white" }}
                          >
                            {event.member_levels.name}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-700">
                          <CalendarIcon className="h-4 w-4 mr-2 text-orange-600" />
                          <span className="text-sm">
                            {new Date(event.event_date).toLocaleDateString("es-MX", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-gray-700">
                            <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        )}
                        {'max_participants' in event && (
                          <div className="flex items-center text-gray-700">
                            <Users className="h-4 w-4 mr-2 text-orange-600" />
                            <span className="text-sm">
                              {event.current_participants || 0} / {event.max_participants} cupos
                            </span>
                          </div>
                        )}
                      </div>

                      {isRegistered ? (
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                          <Check className="h-4 w-4" />
                          <span className="font-semibold">Inscrito</span>
                        </div>
                      ) : !canJoin ? (
                        <div className="bg-red-50 text-red-800 px-4 py-2 rounded-lg text-sm">
                              Requiere nivel: {event.member_levels?.name || "Superior"}
                            </div>
                      ) : !hasCapacity ? (
                        <div className="bg-red-50 text-red-800 px-4 py-2 rounded-lg text-sm">
                              Sin cupos
                            </div>
                      ) : null}

                      <button
                        onClick={() => handleRegister(event.id, 'event')}
                        disabled={isRegistered || !canJoin || !hasCapacity}
                        className={"w-full py-3 rounded-lg font-semibold transition-all " +
                          (isRegistered || !canJoin || !hasCapacity
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-lg')
                        }
                      >
                        {isRegistered ? 'Inscrito' : !canJoin ? 'Nivel insuficiente' : !hasCapacity ? 'Sin cupos' : 'Inscribirse'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tournaments Tab */}
      {activeTab === 'tournaments' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Torneos Disponibles
          </h2>

          {tournaments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay torneos disponibles</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {tournaments.map((tournament) => {
                const isRegistered = checkRegistrationStatus(tournament.id, 'tournament');
                const canJoin = canRegister(tournament.min_level_id, member?.level_id);

                return (
                  <div
                    key={tournament.id}
                    className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all ${
                      isRegistered
                        ? 'border-green-500'
                        : canJoin
                        ? 'border-gray-200 hover:border-orange-500 hover:shadow-xl'
                        : 'border-gray-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800 flex-1">
                        {tournament.name}
                      </h3>
                      {tournament.member_levels && (
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold ml-2"
                          style={{ backgroundColor: tournament.member_levels.color, color: "white" }}
                        >
                          {tournament.member_levels.name}
                        </span>
                      )}
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                      tournament.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : tournament.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.status === 'active' ? 'En Curso' :
                       tournament.status === 'upcoming' ? 'Próximamente' : 'Finalizado'}
                    </div>

                    <div className="space-y-2 mb-4">
                      {tournament.description && (
                        <p className="text-sm text-gray-600">{tournament.description}</p>
                      )}

                      <div className="flex items-center text-gray-700">
                        <CalendarIcon className="h-4 w-4 mr-2 text-orange-600" />
                        <span className="text-sm">
                          Inicio: {new Date(tournament.start_date).toLocaleDateString("es-MX")}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Users className="h-4 w-4 mr-2 text-orange-600" />
                        <span className="text-sm">
                          Máx. Participantes: {tournament.max_participants}
                        </span>
                      </div>

                      {tournament.member_levels && (
                        <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm">
                              Requiere: {tournament.member_levels.name}
                            </div>
                      )}
                    </div>

                    {isRegistered ? (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Check className="h-4 w-4" />
                        <span className="font-semibold">Inscrito</span>
                      </div>
                    ) : !canJoin && (
                      <div className="bg-red-50 text-red-800 px-4 py-2 rounded-lg text-sm">
                    <button
                      onClick={() => handleRegister(tournament.id, 'tournament')}
                      disabled={isRegistered || !canJoin}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        isRegistered || !canJoin
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-lg'
                      }`}
                    >
                      {isRegistered ? 'Inscrito' : !canJoin ? 'Nivel insuficiente' : 'Inscribirse'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* My Registrations Tab */}
      {activeTab === 'my-registrations' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Mis Inscripciones
          </h2>

          {myRegistrations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Info className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tienes inscripciones aún</p>
              <p className="text-sm text-gray-500 mt-2">
                Inscríbete a eventos o torneos para verlos aquí
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                    reg.status === 'approved'
                      ? 'border-green-500'
                      : reg.status === 'rejected'
                      ? 'border-red-500'
                      : reg.status === 'cancelled'
                      ? 'border-gray-400'
                      : 'border-yellow-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          reg.target_type === 'event'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {reg.target_type === 'event' ? 'Evento' : 'Torneo'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${
                          reg.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : reg.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : reg.status === 'cancelled'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reg.status === 'approved' ? 'Aprobada' :
                           reg.status === 'rejected' ? 'Rechazada' :
                           reg.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">
                        Registrado: {new Date(reg.registered_at).toLocaleString('es-MX')}
                      </p>

                      {reg.notes && (
                        <div className="mt-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                              <strong>Notas:</strong> {reg.notes}
                            </div>
                      )}

                      {reg.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRegistration(reg.id)}
                          className="mt-3 text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                          Cancelar Inscripción
                        </button>
                      )}
                    </div>

                    {reg.status === 'approved' && (
                      <div className="flex items-center space-x-2">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
