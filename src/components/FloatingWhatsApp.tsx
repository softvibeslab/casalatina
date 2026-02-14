import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '50256907377';
  const message = encodeURIComponent('Hola! Me gustaría obtener más información sobre Casa Latina Ping Pong Club.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end space-y-3 sm:bottom-6">
        {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 mb-2 max-w-xs border-2 border-chiapas-jade animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex items-start space-x-3">
              <div className="bg-chiapas-jade rounded-full p-2">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">¿Necesitas información?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Envíanos un mensaje por WhatsApp y te responderemos pronto.
                </p>
                <button
                  onClick={handleClick}
                  className="bg-gradient-to-r from-chiapas-jade to-chiapas-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-chiapas-teal hover:to-chiapas-jade transition-all shadow-md w-full"
                >
                  Enviar Mensaje
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative bg-gradient-to-r from-chiapas-jade to-chiapas-teal text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 ${
            isOpen ? 'w-14 h-14' : 'w-16 h-16'
          }`}
          aria-label="WhatsApp"
        >
          <div className="absolute inset-0 bg-chiapas-jade rounded-full opacity-0 group-hover:opacity-20 animate-ping"></div>
          {isOpen ? (
            <X className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          ) : (
            <MessageCircle className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}

          <div className="absolute -top-1 -right-1 bg-chiapas-orange text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            1
          </div>
        </button>
      </div>

      <style>{`
        @keyframes slide-in-from-bottom-4 {
          from {
            transform: translateY(1rem);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-in {
          animation: slide-in-from-bottom-4 0.3s ease-out, fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
