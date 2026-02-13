import { MapPin, Calendar, Music } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
}

export function Hero({ onJoinClick }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-chiapas-blue via-chiapas-blue-dark to-chiapas-blue-light text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/631431591_893588813425031_5944325923659499527_n_copy.jpg)' }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-br from-chiapas-blue/90 via-chiapas-blue-dark/85 to-chiapas-blue-light/80"></div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-chiapas-jade rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-chiapas-orange rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-chiapas-teal rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-8 h-8 bg-white rounded-full opacity-90 shadow-2xl ping-pong-left-to-right" style={{ top: '30%' }}></div>
        <div className="w-8 h-8 bg-white rounded-full opacity-85 shadow-2xl ping-pong-right-to-left" style={{ top: '50%', animationDelay: '2s' }}></div>
        <div className="w-7 h-7 bg-white rounded-full opacity-80 shadow-xl ping-pong-left-to-right" style={{ top: '65%', animationDelay: '1s' }}></div>
        <div className="w-7 h-7 bg-white rounded-full opacity-75 shadow-xl ping-pong-right-to-left" style={{ top: '40%', animationDelay: '3.5s' }}></div>
      </div>

      <style>{`
        @keyframes ping-pong-left-to-right {
          0% {
            left: -50px;
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-30px) scale(1.2);
          }
          50% {
            transform: translateY(-10px) scale(1);
          }
          75% {
            transform: translateY(-40px) scale(1.3);
          }
          100% {
            left: calc(100% + 50px);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes ping-pong-right-to-left {
          0% {
            right: -50px;
            left: auto;
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-35px) scale(1.2);
          }
          50% {
            transform: translateY(-15px) scale(1);
          }
          75% {
            transform: translateY(-45px) scale(1.3);
          }
          100% {
            right: calc(100% + 50px);
            left: auto;
            transform: translateY(0) scale(1);
          }
        }

        .ping-pong-left-to-right {
          position: absolute;
          animation: ping-pong-left-to-right 4s linear infinite;
        }

        .ping-pong-right-to-left {
          position: absolute;
          animation: ping-pong-right-to-left 4s linear infinite;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-6 shadow-2xl transform hover:scale-110 transition-transform float-animation">
              <img
                src="/Captura_de_pantalla_2026-02-13_a_la(s)_11.00.56_a.m..png"
                alt="Casa Latina Logo"
                className="h-32 w-32 object-contain"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl text-white">
            Casa Latina
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-xl text-chiapas-jade">
            Ping Pong Club
          </h2>

          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
            Ping Pong · Música · Arte · Comunidad
          </p>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Únete al mejor club de ping pong en San Cristóbal de las Casas
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 bg-chiapas-jade/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">San Cristóbal de las Casas</span>
            </div>
            <div className="flex items-center space-x-2 bg-chiapas-teal/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">Martes, Miércoles, Jueves</span>
            </div>
            <div className="flex items-center space-x-2 bg-chiapas-jade/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform">
              <Music className="h-5 w-5" />
              <span className="font-semibold">Música en Vivo</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onJoinClick}
              className="bg-gradient-to-r from-chiapas-jade to-chiapas-teal text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-chiapas-teal hover:to-chiapas-jade transform hover:scale-105 transition-all shadow-2xl"
            >
              Únete al Club
            </button>
            <button
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent border-2 border-chiapas-jade text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-chiapas-jade/20 transition-all shadow-xl"
            >
              Ver Eventos
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </div>
  );
}
