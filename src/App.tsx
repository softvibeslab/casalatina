import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventsList } from './components/EventsList';
import { Leaderboard } from './components/Leaderboard';
import { Tournaments } from './components/Tournaments';
import { AuthForm } from './components/AuthForm';
import { MemberRegistration } from './components/MemberRegistration';
import { AdminDashboard } from './components/AdminDashboard';
import { ClubInfo } from './components/ClubInfo';
import { Location } from './components/Location';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

function AppContent() {
  const [currentSection, setCurrentSection] = useState('home');
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chiapas-blue to-chiapas-blue-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-chiapas-jade mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleJoinClick = () => {
    setCurrentSection('register');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={setCurrentSection} currentSection={currentSection} />
      <FloatingWhatsApp />

      {currentSection === 'home' && (
        <>
          <Hero onJoinClick={handleJoinClick} />
          <ClubInfo />
          <Location />
          <EventsList />
        </>
      )}

      {currentSection === 'events' && <EventsList />}

      {currentSection === 'leaderboard' && <Leaderboard />}

      {currentSection === 'tournaments' && <Tournaments />}

      {currentSection === 'auth' && (
        <AuthForm onSuccess={() => setCurrentSection('home')} />
      )}

      {currentSection === 'register' && <MemberRegistration />}

      {currentSection === 'admin' && <AdminDashboard />}

      <footer className="bg-gradient-to-r from-chiapas-blue-dark via-chiapas-blue to-chiapas-blue-light text-white py-8 mt-16 border-t-4 border-chiapas-jade">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <img
                src="/Captura_de_pantalla_2026-02-13_a_la(s)_11.00.56_a.m..png"
                alt="Casa Latina Logo"
                className="h-12 w-12 object-contain bg-white rounded-full p-1"
              />
            </div>
            <h3 className="text-2xl font-bold mb-2">Casa Latina Ping Pong Club</h3>
            <p className="text-blue-100 mb-4">San Cristóbal de las Casas, Chiapas</p>
            <div className="flex justify-center items-center space-x-2 text-blue-200">
              <span className="text-chiapas-jade font-semibold">Ping Pong</span>
              <span>•</span>
              <span className="text-chiapas-teal font-semibold">Música</span>
              <span>•</span>
              <span className="text-white font-semibold">Arte</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
