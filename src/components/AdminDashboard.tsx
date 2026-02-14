import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Trophy, Users, X, Award, Shield, Trophy as TrophyIcon, Medal, ListChecks, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Event, Tournament, Member, MemberLevel, Achievement, Registration, Notification } from '../types';

type TabType = 'events' | 'tournaments' | 'members' | 'rankings' | 'registrations' | 'achievements' | 'club-info';

export function AdminDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [members, setMembers] = useState<(Member & { profiles?: { full_name: string; email: string } })[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [memberLevels, setMemberLevels] = useState<MemberLevel[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTournamentForm, setShowTournamentForm] = useState(false);

  useEffect(() => {
    if (profile?.extended_role === 'admin' || profile?.extended_role === 'leader') {
      loadData();
    }
  }, [profile, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'events') {
        const { data } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: false });
        setEvents(data || []);
      } else if (activeTab === 'tournaments') {
        const { data } = await supabase
          .from('tournaments')
          .select('*')
          .order('start_date', { ascending: false });
        setTournaments(data || []);
      } else if (activeTab === 'members') {
        const { data } = await supabase
          .from('members')
          .select(`
            *,
            profiles (
              full_name,
              email
            )
          `)
          .order('joined_at', { ascending: false });
        setMembers(data || []);
      } else if (activeTab === 'registrations') {
        const { data } = await supabase
          .from('registrations')
          .select(`
            *,
            profiles (
              full_name,
              email
            )
          `)
          .eq('status', 'pending')
          .order('registered_at', { ascending: false });
        setRegistrations(data || []);
      } else if (activeTab === 'achievements') {
        const { data } = await supabase
          .from('achievements')
          .select('*')
          .order('created_at', { ascending: false });
        setAchievements(data || []);
      } else if (activeTab === 'rankings') {
        // Rankings data is loaded in the RankingManagement component
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error al eliminar el evento');
    }
  };

  const deleteTournament = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este torneo?')) return;

    try {
      const { error } = await supabase.from('tournaments').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Error al eliminar el torneo');
    }
  };

  const updateMemberStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ membership_status: status })
        .eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error al actualizar el miembro');
    }
  };

  const updateRegistration = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.id,
          notes: notes || null
        })
        .eq('id', id);

      if (error) throw error;

      // If approved, update current_participants
      if (status === 'approved') {
        const registration = registrations.find(r => r.id === id);
        if (registration) {
          const table = registration.target_type;
          await supabase
            .from(table === 'event' ? 'events' : 'tournaments')
            .update({
              current_participants: supabase.raw(`current_participants + 1`)
            })
            .eq('id', registration.target_id);
        }
      }

      loadData();
      alert(status === 'approved' ? 'Inscripción aprobada' : 'Inscripción rechazada');
    } catch (error) {
      console.error('Error updating registration:', error);
      alert('Error al actualizar la inscripción');
    }
  };

  // Check if user is admin or leader
  const isAdminOrLeader = profile?.extended_role === 'admin' || profile?.extended_role === 'leader';
  const isAdmin = profile?.extended_role === 'admin';

  if (!isAdminOrLeader) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-xl text-gray-600">No tienes permisos de administración</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Panel de {isAdmin ? 'Administración' : 'Gestión'}
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'events'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span>Eventos</span>
        </button>
        <button
          onClick={() => setActiveTab('tournaments')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'tournaments'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <TrophyIcon className="h-5 w-5" />
          <span>Torneos</span>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'members'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Miembros</span>
        </button>
        <button
          onClick={() => setActiveTab('rankings')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'rankings'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Medal className="h-5 w-5" />
          <span>Clasificación</span>
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'registrations'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ListChecks className="h-5 w-5" />
          <span>Inscripciones</span>
        </button>
        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'achievements'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Award className="h-5 w-5" />
              <span>Logros</span>
            </button>
            <button
              onClick={() => setActiveTab('club-info')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'club-info'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Info className="h-5 w-5" />
              <span>Info Club</span>
            </button>
          </>
        )}
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Eventos</h2>
            <button
              onClick={() => setShowEventForm(true)}
              className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Evento</span>
            </button>
          </div>

          {showEventForm && <EventForm onClose={() => { setShowEventForm(false); loadData(); }} />}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {event.flyer_url ? (
                            <img
                              src={event.flyer_url}
                              alt={event.title}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{event.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{event.event_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(event.event_date).toLocaleDateString('es-MX')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{event.location || '-'}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tournaments Tab */}
      {activeTab === 'tournaments' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Torneos</h2>
            <button
              onClick={() => setShowTournamentForm(true)}
              className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Torneo</span>
            </button>
          </div>

          {showTournamentForm && <TournamentForm onClose={() => { setShowTournamentForm(false); loadData(); }} />}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Máx. Participantes</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tournaments.map((tournament) => (
                      <tr key={tournament.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{tournament.name}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            tournament.status === 'active' ? 'bg-green-100 text-green-800' :
                            tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tournament.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(tournament.start_date).toLocaleDateString('es-MX')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{tournament.max_participants}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => deleteTournament(tournament.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Miembros</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">XP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{member.profiles?.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.profiles?.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.phone || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={member.membership_status}
                            onChange={(e) => updateMemberStatus(member.id, e.target.value)}
                            className="px-2 py-1 rounded border border-gray-300"
                          >
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                            <option value="pending">Pendiente</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-orange-600">{member.xp_total || 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(member.joined_at).toLocaleDateString('es-MX')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Registrations Tab - NEW */}
      {activeTab === 'registrations' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Inscripciones Pendientes ({registrations.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <ListChecks className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No hay inscripciones pendientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div key={reg.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {reg.profiles?.full_name}
                      </h3>
                      <p className="text-sm text-gray-600">{reg.profiles?.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      reg.target_type === 'event'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {reg.target_type === 'event' ? 'Evento' : 'Torneo'}
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => updateRegistration(reg.id, 'approved')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt('Notas opcionales (por qué se rechaza):');
                        if (notes !== null) updateRegistration(reg.id, 'rejected', notes);
                      }}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Rechazar
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Registrado: {new Date(reg.registered_at).toLocaleString('es-MX')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Achievements Tab - ADMIN ONLY */}
      {activeTab === 'achievements' && isAdmin && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Logros</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icono</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">XP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {achievements.map((achievement) => (
                      <tr key={achievement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-2xl">{achievement.icon}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{achievement.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{achievement.description || '-'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-orange-600">+{achievement.xp_reward}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{achievement.category || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Club Info Tab - ADMIN ONLY */}
      {activeTab === 'club-info' && isAdmin && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Información del Club</h2>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600 mb-4">
              Esta sección permite editar la información del club que aparece en la página principal.
              </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-orange-600">
                <Info className="h-5 w-5" />
                <span className="font-medium">Próximamente: Editor completo de información del club</span>
              </div>
              <div className="text-sm text-gray-500">
                Campos disponibles: Descripción, Horarios, Contacto, Precios
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rankings Tab - PLACEHOLDER */}
      {activeTab === 'rankings' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Clasificación</h2>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600 mb-4">
              Gestión completa de ranking de jugadores.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-orange-600">
                <Medal className="h-5 w-5" />
                <span className="font-medium">Próximamente: Herramientas de ranking</span>
              </div>
              <div className="text-sm text-gray-500">
                - Editar puntos manualmente
                <br />
                - Gestionar estadísticas de jugadores
                <br />
                - Resetear temporadas
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_type: 'training',
    location: '',
    flyer_url: '',
    min_level_id: '',
    max_participants: '',
    registration_enabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, flyer_url: reader.result as string });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('events').insert({
        title: formData.title,
        description: formData.description || null,
        event_date: formData.event_date,
        event_type: formData.event_type,
        location: formData.location || null,
        flyer_url: formData.flyer_url || null,
        min_level_id: formData.min_level_id || null,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        registration_enabled: formData.registration_enabled,
        created_by: user?.id,
      });

      if (error) throw error;
      alert('Evento creado exitosamente');
      onClose();
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(error.message || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Nuevo Evento</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Flyer del Evento</label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={uploading}
            />
            {formData.flyer_url && (
              <div className="relative">
                <img
                  src={formData.flyer_url}
                  alt="Flyer preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, flyer_url: '' })}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {uploading && (
              <p className="text-sm text-gray-500">Subiendo imagen...</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
            <input
              type="datetime-local"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={formData.event_type}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="training">Entreno y Retas</option>
              <option value="tournament">Torneo</option>
              <option value="social">Social</option>
              <option value="documentary">Proyección</option>
              <option value="other">Otro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Mínimo</label>
            <select
              value={formData.min_level_id}
              onChange={(e) => setFormData({ ...formData, min_level_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Todos los niveles</option>
              <option value="1">Principiante</option>
              <option value="2">Intermedio</option>
              <option value="3">Avanzado</option>
              <option value="4">Elite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Participantes</label>
            <input
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min={2}
              placeholder="Ilimitado"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.registration_enabled}
            onChange={(e) => setFormData({ ...formData, registration_enabled: e.target.checked })}
            className="rounded"
          />
          <label className="text-sm font-medium text-gray-700">Inscripción habilitada</label>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Evento'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

function TournamentForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    max_participants: 16,
    status: 'upcoming',
    min_level_id: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('tournaments').insert({
        ...formData,
        created_by: user?.id,
      });

      if (error) throw error;
      alert('Torneo creado exitosamente');
      onClose();
    } catch (error: any) {
      console.error('Error creating tournament:', error);
      alert(error.message || 'Error al crear el torneo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Nuevo Torneo</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Participantes</label>
            <input
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Mínimo</label>
            <select
              value={formData.min_level_id}
              onChange={(e) => setFormData({ ...formData, min_level_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Todos los niveles</option>
              <option value="1">Principiante</option>
              <option value="2">Intermedio</option>
              <option value="3">Avanzado</option>
              <option value="4">Elite</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="upcoming">Próximamente</option>
            <option value="active">Activo</option>
            <option value="completed">Finalizado</option>
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Torneo'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
