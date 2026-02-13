import { MapPin, Navigation } from 'lucide-react';

export function Location() {
  const address = '12 de Septiembre 34, Barrio de la Merced, 29240 San Cristóbal de las Casas, Chis.';
  const googleMapsUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.8987654321!2d-92.6376!3d16.7370!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQ0JzEzLjIiTiA5MsKwMzgnMTUuNCJX!5e0!3m2!1sen!2smx!4v1234567890';
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=12+de+Septiembre+34,+Barrio+de+la+Merced,+29240+San+Cristóbal+de+las+Casas,+Chiapas';

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ubicación</h2>
          <p className="text-xl text-gray-600">Encuéntranos en el corazón de San Cristóbal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-chiapas-blue/20">
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-chiapas-blue/10 p-4 rounded-full">
                <MapPin className="h-8 w-8 text-chiapas-blue" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Casa Latina</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{address}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-chiapas-jade/10 to-chiapas-teal/10 rounded-xl p-6 border border-chiapas-jade/30">
                <h4 className="font-bold text-gray-900 mb-3 text-lg">Horarios de Actividades</h4>
                <div className="space-y-2 text-gray-700">
                  <p className="flex justify-between">
                    <span className="font-semibold text-chiapas-blue">Martes:</span>
                    <span>Clases & Retas - 5pm a 7pm</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-chiapas-blue">Miércoles:</span>
                    <span>Cinema - 8pm</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-chiapas-blue">Jueves:</span>
                    <span>Clases & Retas - 5pm a 7pm</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-chiapas-orange">Domingo:</span>
                    <span>Eventos Especiales - 5pm a 10pm</span>
                  </p>
                </div>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-chiapas-blue to-chiapas-blue-light text-white px-6 py-4 rounded-xl font-bold hover:from-chiapas-blue-dark hover:to-chiapas-blue transition-all shadow-lg transform hover:scale-105"
              >
                <Navigation className="h-5 w-5" />
                <span>Cómo Llegar</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-chiapas-blue/20 h-full min-h-[500px]">
            <iframe
              src={googleMapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '500px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Casa Latina"
              className="rounded-2xl"
            ></iframe>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg">
            <span className="font-semibold text-chiapas-jade">Barrio de la Merced</span> -
            Un espacio dedicado al ping pong, música y arte en comunidad
          </p>
        </div>
      </div>
    </section>
  );
}
