import { Menu, X, Trophy, Calendar, Users, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export function Navbar({ onNavigate, currentSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Trophy },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'leaderboard', label: 'Clasificación', icon: BarChart3 },
    { id: 'tournaments', label: 'Torneos', icon: Trophy },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: Users });
  }

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-chiapas-blue via-chiapas-blue-dark to-chiapas-blue-light shadow-lg sticky top-0 z-50 border-b-2 border-chiapas-jade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <img
              src="/Captura_de_pantalla_2026-02-13_a_la(s)_11.00.56_a.m..png"
              alt="Casa Latina Logo"
              className="h-10 w-10 object-contain bg-white rounded-full p-1"
            />
            <span className="text-white font-bold text-xl hidden sm:block">Casa Latina</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    currentSection === item.id
                      ? 'bg-chiapas-jade text-white shadow-lg'
                      : 'text-white hover:bg-chiapas-blue-light'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {profile ? (
              <>
                <span className="text-white text-sm font-medium">{profile.full_name}</span>
                <button
                  onClick={signOut}
                  className="bg-chiapas-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-chiapas-red transition-colors shadow-lg"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="bg-chiapas-jade text-white px-4 py-2 rounded-lg font-medium hover:bg-chiapas-teal transition-colors shadow-lg"
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-chiapas-blue-dark">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg ${
                    currentSection === item.id
                      ? 'bg-chiapas-jade text-white'
                      : 'text-white hover:bg-chiapas-blue-light'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            {profile ? (
              <button
                onClick={signOut}
                className="w-full text-left px-3 py-2 text-white hover:bg-purple-600 rounded-lg"
              >
                Salir ({profile.full_name})
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full text-left px-3 py-2 text-white hover:bg-purple-600 rounded-lg"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
