'use client';

import { useState } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';

export default function ManageAdminsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Administrador registrado con éxito');
        setFormData({ name: '', email: '', password: '' });
      } else {
        setMessage(data.error || 'Error al registrar');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        <header className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">NUEVO ADMIN</h1>
          <div className="w-20 h-2 bg-black dark:bg-white"></div>
        </header>

        {message && (
          <div className="p-8 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black">
            <p className="text-xs font-black uppercase tracking-widest">{message}</p>
          </div>
        )}

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="JOHN DOE"
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Email Corporativo</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="ADMIN@ELDENT.COM"
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Contraseña Temporal</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-12 py-6 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'REGISTRANDO...' : 'CREAR ADMINISTRADOR'}
            </button>
          </form>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
