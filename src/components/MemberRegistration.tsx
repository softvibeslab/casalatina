import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Member } from '../types';
import { UserCheck, Phone, CheckCircle } from 'lucide-react';

export function MemberRegistration() {
  const { user, profile } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingMembership, setCheckingMembership] = useState(true);

  useEffect(() => {
    if (user) {
      checkMembership();
    }
  }, [user]);

  const checkMembership = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      setMember(data);
      if (data?.phone) {
        setPhone(data.phone);
      }
    } catch (error) {
      console.error('Error checking membership:', error);
    } finally {
      setCheckingMembership(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('members')
        .insert({
          user_id: user!.id,
          phone: phone || null,
          membership_status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      setMember(data);

      const { error: playerError } = await supabase
        .from('players')
        .insert({
          user_id: user!.id,
        });

      if (playerError) throw playerError;

      alert('¡Registro exitoso! Bienvenido al club.');
    } catch (error: any) {
      console.error('Error registering:', error);
      alert(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-600">
          Por favor inicia sesión para registrarte como miembro del club
        </p>
      </div>
    );
  }

  if (checkingMembership) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (member) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 border border-green-200">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ¡Ya eres Miembro!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Bienvenido al Casa Latina Ping Pong Club
            </p>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-3 text-left">
                <div>
                  <span className="text-sm font-medium text-gray-600">Nombre:</span>
                  <p className="text-lg text-gray-800">{profile?.full_name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <p className="text-lg text-gray-800">{profile?.email}</p>
                </div>
                {member.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                    <p className="text-lg text-gray-800">{member.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 ml-2">
                    {member.membership_status === 'active' ? 'Activo' : member.membership_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <UserCheck className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Únete al Club
          </h2>
          <p className="text-gray-600">
            Completa tu registro para ser parte de Casa Latina Ping Pong Club
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>Beneficios de ser miembro:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-orange-700">
              <li>• Participación en todos los eventos y entrenamientos</li>
              <li>• Registro en torneos oficiales</li>
              <li>• Seguimiento de tu progreso y estadísticas</li>
              <li>• Acceso a la tabla de clasificación</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+52 123 456 7890"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Completar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
}
