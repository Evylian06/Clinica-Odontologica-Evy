'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar administrador');
      }

      router.push('/admin/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-olive-950 text-sky-950 dark:text-olive-50 flex items-center justify-center p-6 transition-colors duration-500 selection:bg-sky-500 selection:text-white dark:selection:bg-olive-500 dark:selection:text-black">
      <div className="w-full max-w-xl">
        <div className="space-y-16">
          <header className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase text-sky-900 dark:text-olive-100">UNIRSE ADMIN</h1>
            <div className="w-24 h-3 bg-sky-500 dark:bg-olive-400"></div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
              <div className="p-6 border-2 border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-black text-xs uppercase tracking-widest rounded-2xl">
                {error}
              </div>
            )}

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400">Nombre completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-transparent border-b-2 border-sky-200 dark:border-olive-800/60 py-4 text-2xl font-bold focus:outline-none focus:border-sky-500 dark:focus:border-olive-400 transition-all placeholder:text-sky-300 dark:placeholder:text-olive-700 text-sky-900 dark:text-olive-100 uppercase"
                  placeholder="NOMBRE COMPLETO"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400">Email Corporativo</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-transparent border-b-2 border-sky-200 dark:border-olive-800/60 py-4 text-2xl font-bold focus:outline-none focus:border-sky-500 dark:focus:border-olive-400 transition-all placeholder:text-sky-300 dark:placeholder:text-olive-700 text-sky-900 dark:text-olive-100 uppercase"
                  placeholder="ADMIN@ELDENT.COM"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full bg-transparent border-b-2 border-sky-200 dark:border-olive-800/60 py-4 text-2xl font-bold focus:outline-none focus:border-sky-500 dark:focus:border-olive-400 transition-all placeholder:text-sky-300 dark:placeholder:text-olive-700 text-sky-900 dark:text-olive-100"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400">Confirmar</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="w-full bg-transparent border-b-2 border-sky-200 dark:border-olive-800/60 py-4 text-2xl font-bold focus:outline-none focus:border-sky-500 dark:focus:border-olive-400 transition-all placeholder:text-sky-300 dark:placeholder:text-olive-700 text-sky-900 dark:text-olive-100"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-8 bg-sky-600 hover:bg-sky-700 dark:bg-olive-600 dark:hover:bg-olive-700 text-white text-xl font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-sky-200 dark:shadow-olive-900/30 rounded-2xl"
            >
              {loading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
            </button>
          </form>

          <footer className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-sky-200/50 dark:border-olive-800/30">
            <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400 hover:text-sky-900 dark:hover:text-olive-200 transition-all">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400 hover:text-sky-900 dark:hover:text-olive-200 transition-all">
              Volver al inicio
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
