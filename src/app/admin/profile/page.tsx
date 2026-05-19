'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface Admin {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData && adminData !== 'undefined') {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (e) {
        console.error('Error parsing admin data in profile:', e);
      }
    }
  }, []);

  const { enableNotifications, permission } = usePushNotifications(admin?.id || null, true);

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEnableNotifications = async () => {
    await enableNotifications();
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Contraseña actualizada con éxito');
        setNewPassword('');
      } else {
        setMessage(data.error);
      }
    } catch {
      setMessage('Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <AdminDashboardLayout>
        <div className="text-center py-20 animate-pulse">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Cargando Sistema...</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        <header className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">PERFIL</h1>
          <div className="w-20 h-2 bg-black dark:bg-white"></div>
        </header>

        {message && (
          <div className="p-8 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black animate-in fade-in slide-in-from-top-4">
            <p className="text-xs font-black uppercase tracking-widest">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-12">
            <div className="group relative w-64 h-64 overflow-hidden border-8 border-neutral-100 dark:border-neutral-900">
              <div className="absolute inset-0 bg-black dark:bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <span className="text-white dark:text-black text-8xl font-black">{admin.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">{admin.name}</h2>
              <div className="inline-block py-3 px-8 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.4em]">ADMINISTRADOR DEL SISTEMA</div>
            </div>

            {/* Change Password Form */}
            <div className="pt-12 space-y-12">
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter uppercase">Seguridad</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Update your access credentials</p>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-8 max-w-md">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent border-b-4 border-neutral-100 dark:border-neutral-900 py-6 text-3xl font-black focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none placeholder:text-neutral-200 dark:placeholder:text-neutral-800"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
                </button>
              </form>
            </div>

            {/* Notifications Settings */}
            <div className="pt-12 space-y-12">
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter uppercase">Notificaciones</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Configura tus alertas en tiempo real</p>
              </div>
              <div className="space-y-6 max-w-md">
                <div className="p-6 border-2 border-neutral-100 dark:border-neutral-900 rounded-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest mb-1">Notificaciones Push</p>
                      <p className="text-xs text-neutral-500">
                        {permission === 'granted' ? 'Habilitadas' : permission === 'denied' ? 'Deshabilitadas' : 'No configuradas'}
                      </p>
                    </div>
                    {permission !== 'granted' && (
                      <button
                        onClick={handleEnableNotifications}
                        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        Habilitar
                      </button>
                    )}
                    {permission === 'granted' && (
                      <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full ml-7"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-px bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900/50 shadow-2xl">
            {[
              { label: 'Email Address', value: admin.email.toUpperCase() },
              { label: 'Official Name', value: admin.name.toUpperCase() },
              { label: 'Access Level', value: 'ROOT ADMINISTRATOR' },
              { label: 'System ID', value: `#${admin.id}` },
              { label: 'Member Since', value: new Date(admin.created_at).toLocaleDateString('es-ES').toUpperCase() },
            ].map((item, i) => (
              <div key={i} className="group bg-white dark:bg-black p-12 space-y-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-all">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">{item.label}</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight text-black dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
