'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) {
        throw new Error('Error al eliminar cuenta');
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Error al eliminar cuenta');
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-24">
        <header className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">AJUSTES</h1>
          <div className="w-20 h-2 bg-black dark:bg-white"></div>
        </header>

        {message && (
          <div className="py-6 border-b-2 border-red-500 animate-in fade-in slide-in-from-top-4">
            <p className="font-black uppercase tracking-widest text-sm text-red-500">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-100 dark:bg-neutral-900/50">
          <div className="p-8 md:p-16 bg-white dark:bg-black space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Sesión</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Manage your active access</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-8 border-2 border-black dark:border-white text-black dark:text-white text-sm font-black uppercase tracking-[0.4em] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
            >
              Log Out
            </button>
          </div>

          <div className="p-8 md:p-16 bg-white dark:bg-black space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Sistema</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Environment information</p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-neutral-50 dark:border-neutral-900 pb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Versión</span>
                <span className="font-bold text-sm text-black dark:text-white">1.2.0-STABLE</span>
              </div>
              <div className="flex justify-between items-end border-b border-neutral-50 dark:border-neutral-900 pb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Estado</span>
                <span className="font-bold text-sm flex items-center gap-2 text-black dark:text-white">
                  <div className="w-2 h-2 bg-black dark:bg-white animate-pulse"></div>
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-16 bg-white dark:bg-black lg:col-span-2 space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase text-red-500">Peligro</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/30">Irreversible actions</p>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium max-w-xl leading-relaxed">
              Eliminar tu cuenta borrará permanentemente todos tus registros médicos y citas. Esta acción no se puede deshacer.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="py-6 px-12 border-2 border-red-500/20 text-red-500/40 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
