import { Clock, MapPin, Users, Music, Palette } from 'lucide-react';

export function ClubInfo() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Sobre Casa Latina
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un espacio donde el ping pong se encuentra con la cultura, la música y el arte
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src="/comunidad.png"
              alt="Espacio Casa Latina"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-chiapas-blue/20 rounded-full mb-3">
                <Users className="h-6 w-6 text-chiapas-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Comunidad</h3>
              <p className="text-gray-600">
                Un espacio inclusivo para jugadores de todos los niveles
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src="/musica.png"
              alt="Mesa de Ping Pong"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-chiapas-jade/20 rounded-full mb-3">
                <Music className="h-6 w-6 text-chiapas-jade" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Música</h3>
              <p className="text-gray-600">
                Eventos especiales con música en vivo y DJs locales
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src="/arte.png"
              alt="Jugando Ping Pong"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-chiapas-orange/20 rounded-full mb-3">
                <Palette className="h-6 w-6 text-chiapas-orange" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Arte</h3>
              <p className="text-gray-600">
                Proyecciones de documentales y exposiciones artísticas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-chiapas-blue/10 rounded-2xl p-8 border-2 border-chiapas-blue/30 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock className="h-7 w-7 text-chiapas-jade mr-3" />
                Horarios
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow">
                  <div className="flex-shrink-0 w-24 font-bold text-chiapas-red">
                    Martes
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Clases & Retas</p>
                    <p className="text-gray-600">5:00 PM - 7:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow">
                  <div className="flex-shrink-0 w-24 font-bold text-blue-600">
                    Miércoles
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Cinema: Documental</p>
                    <p className="text-gray-600">8:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow">
                  <div className="flex-shrink-0 w-24 font-bold text-chiapas-red">
                    Jueves
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Clases & Retas</p>
                    <p className="text-gray-600">5:00 PM - 7:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow">
                  <div className="flex-shrink-0 w-24 font-bold text-chiapas-yellow">
                    Domingo
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Inauguración: Música & Pong</p>
                    <p className="text-gray-600">5:00 PM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <MapPin className="h-7 w-7 text-chiapas-teal mr-3" />
                Ubicación
              </h3>
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <p className="font-bold text-xl text-gray-800 mb-2">Casa Latina</p>
                <p className="text-gray-600 mb-1">12 de septiembre #34</p>
                <p className="text-gray-600 mb-1">Barrio La Merced</p>
                <p className="text-gray-600 mb-1">San Cristóbal de las Casas</p>
                <p className="text-gray-600">Chiapas, México</p>
              </div>

              <div className="bg-gradient-to-r from-chiapas-jade to-chiapas-teal p-6 rounded-lg shadow-lg text-white">
                <p className="font-bold text-lg mb-2">
                  Ping Pong · Música · Arte · Comunidad
                </p>
                <p className="text-sm text-white/90">
                  Espacio cultural que combina deporte, expresión artística y conexión comunitaria
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
