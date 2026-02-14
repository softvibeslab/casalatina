import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Info, Users, Award as TrophyIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Event } from '../types';

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          member_levels (*)
        `)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      training: 'bg-blue-100 text-blue-800 border-blue-200',
      tournament: 'bg-orange-100 text-orange-800 border-orange-200',
      social: 'bg-green-100 text-green-800 border-green-200',
      documentary: 'bg-purple-100 text-purple-800 border-purple-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getEventTypeLabel = (type: string) => {
    const labels = {
      training: 'Entreno y Retas',
      tournament: 'Torneo',
      social: 'Social',
      documentary: 'Proyección',
      other: 'Otro',
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <>
      <div id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Próximos Eventos
        </h2>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No hay eventos próximos</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const hasCapacity = event.max_participants
                ? (event.current_participants || 0) < event.max_participants
                : true;

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Event Image/Header */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                    {event.flyer_url ? (
                      <img
                        src={event.flyer_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="h-16 w-16 text-orange-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${getEventTypeColor(
                          event.event_type
                        )}`}
                      >
                        {getEventTypeLabel(event.event_type)}
                      </span>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Level Requirement Badge */}
                    {event.member_levels && (
                      <div className="mb-3 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Nivel requerido:</span>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: event.member_levels.color,
                            color: 'white'
                          }}
                        >
                          {event.member_levels.name}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                        <span className="text-sm">{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                        <span className="text-sm">{formatTime(event.event_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Capacity Info */}
                    {'max_participants' in event && (
                      <div className="mb-4 flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-700">
                          <Users className="h-4 w-4 mr-2 text-orange-600" />
                          <span>
                            {event.current_participants || 0} / {event.max_participants} cupos
                          </span>
                        </div>
                        {!hasCapacity && (
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                            Completo
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white py-2.5 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Info className="h-4 w-4" />
                      <span>Ver Detalles</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Flyer */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
              {selectedEvent.flyer_url ? (
                <img
                  src={selectedEvent.flyer_url}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="h-24 w-24 text-orange-300" />
                </div>
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${getEventTypeColor(
                    selectedEvent.event_type
                  )}`}
                >
                  {getEventTypeLabel(selectedEvent.event_type)}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedEvent.title}
              </h3>

              {selectedEvent.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Descripción
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2.5 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(selectedEvent.event_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2.5 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="font-semibold text-gray-800">
                      {formatTime(selectedEvent.event_date)}
                    </p>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2.5 rounded-lg">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ubicación</p>
                      <p className="font-semibold text-gray-800">
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEvent.member_levels && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2.5 rounded-lg">
                      <TrophyIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nivel Requerido</p>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-sm font-semibold ml-2"
                        style={{
                          backgroundColor: selectedEvent.member_levels.color,
                          color: 'white'
                        }}
                      >
                        {selectedEvent.member_levels.name}
                      </span>
                    </div>
                  </div>
                )}

                {'max_participants' in selectedEvent && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2.5 rounded-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cupos</p>
                      <p className="font-semibold text-gray-800">
                        {selectedEvent.current_participants || 0} / {selectedEvent.max_participants}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
