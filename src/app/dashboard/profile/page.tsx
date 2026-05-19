'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [message, setMessage] = useState('');

  const { enableNotifications, permission } = usePushNotifications(user?.id || null, false);

  const handleEnableNotifications = async () => {
    await enableNotifications();
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name,
        phone: parsedUser.phone || '',
      });
    }
  }, []);

  const handleSave = async () => {
    setMessage('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: user?.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar perfil');
      }

      setMessage('Perfil actualizado exitosamente');
      setUser({ ...user, ...formData } as User);
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
      setEditing(false);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Error al actualizar perfil');
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p>Cargando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full space-y-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">PERFIL</h1>
            <div className="w-20 h-2 bg-black dark:bg-white"></div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="py-6 px-12 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all"
            >
              Edit Info
            </button>
          )}
        </header>

        {message && (
          <div className="py-6 border-b-2 border-black dark:border-white animate-in fade-in slide-in-from-top-4">
            <p className="font-black uppercase tracking-widest text-sm">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
          <div className="lg:col-span-2 space-y-20">
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Email</label>
                  <div className="text-xl md:text-2xl font-bold text-neutral-500 dark:text-neutral-500 border-b-2 border-neutral-100 dark:border-neutral-900 py-4">
                    {user.email.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase text-black dark:text-white"
                    />
                  ) : (
                    <div className="text-2xl font-bold border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-black dark:text-white">
                      {user.name.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase text-black dark:text-white"
                    />
                  ) : (
                    <div className="text-2xl font-bold border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-black dark:text-white">
                      {(user.phone || 'NOT SET').toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Member Since</label>
                  <div className="text-2xl font-bold border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-black dark:text-white">
                    {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).toUpperCase()}
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex gap-4 pt-12">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-10 bg-black dark:bg-white text-white dark:text-black text-xl font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({ name: user.name, phone: user.phone || '' });
                    }}
                    className="flex-1 py-10 border-2 border-neutral-100 dark:border-neutral-900 text-black dark:text-white text-xl font-black uppercase tracking-[0.4em] hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Notifications Settings */}
              <div className="pt-12 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tighter uppercase">Notificaciones</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Configura tus alertas en tiempo real</p>
                </div>
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

          <div className="space-y-12">
            <div className="bg-black dark:bg-white p-16 text-white dark:text-black space-y-10">
              <div className="w-16 h-2 bg-white dark:bg-black"></div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">{user.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">{user.email}</p>
              </div>
              <div className="pt-10 border-t border-white/10 dark:border-black/10">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Status</p>
                <p className="text-xl font-black uppercase tracking-tighter">Verified User</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
