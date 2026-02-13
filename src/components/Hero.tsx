import { MapPin, Calendar, Music } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
}

export function Hero({ onJoinClick }: HeroProps) {
  return (
    <div className="relative text-white overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0a1128 0%, #001f54 50%, #0a1128 100%)' }}>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
          <div className="ping-pong-table">
            <div className="table-surface"></div>
            <div className="table-net"></div>
            <div className="table-line"></div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="ping-pong-ball ball-1"></div>
        <div className="ping-pong-ball ball-2"></div>
        <div className="ping-pong-ball ball-3"></div>
      </div>

      <style>{`
        .ping-pong-table {
          position: relative;
          width: 80%;
          max-width: 900px;
          height: 400px;
          transform: rotateX(60deg) rotateZ(0deg);
          transform-style: preserve-3d;
          opacity: 0.15;
        }

        .table-surface {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #0ea5e9 100%);
          border: 8px solid #fff;
          box-shadow:
            0 20px 60px rgba(6, 182, 212, 0.4),
            inset 0 0 40px rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .table-net {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 60px;
          background: linear-gradient(to bottom,
            transparent 0%,
            rgba(255, 255, 255, 0.9) 10%,
            rgba(255, 255, 255, 0.9) 90%,
            transparent 100%
          );
          transform: translateY(-50%) translateZ(30px);
          border-top: 3px solid #fff;
          border-bottom: 3px solid #fff;
        }

        .table-line {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 3px;
          background: white;
          transform: translateY(-50%);
        }

        @keyframes bounce-ball {
          0% {
            left: 10%;
            top: 10%;
            transform: scale(1);
          }
          25% {
            left: 90%;
            top: 10%;
            transform: scale(1.3);
          }
          50% {
            left: 90%;
            top: 85%;
            transform: scale(1);
          }
          75% {
            left: 10%;
            top: 85%;
            transform: scale(1.3);
          }
          100% {
            left: 10%;
            top: 10%;
            transform: scale(1);
          }
        }

        .ping-pong-ball {
          position: absolute;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle at 30% 30%, #ffffff, #f0f0f0, #e0e0e0);
          border-radius: 50%;
          box-shadow:
            0 5px 15px rgba(0, 0, 0, 0.3),
            inset -2px -2px 5px rgba(0, 0, 0, 0.2),
            0 0 20px rgba(255, 255, 255, 0.8);
          animation: bounce-ball 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        .ball-1 {
          animation-delay: 0s;
          animation-duration: 3s;
        }

        .ball-2 {
          animation-delay: 1s;
          animation-duration: 3.5s;
        }

        .ball-3 {
          animation-delay: 2s;
          animation-duration: 2.8s;
          width: 18px;
          height: 18px;
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
