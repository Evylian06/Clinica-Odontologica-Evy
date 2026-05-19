'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de recuperación de contraseña
    setTimeout(() => {
      setMessage('Si el correo existe en nuestro sistema, recibirá instrucciones para restablecer su contraseña.');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-olive-950 text-sky-950 dark:text-olive-50 flex items-center justify-center p-6 transition-colors duration-500 selection:bg-sky-500 selection:text-white dark:selection:bg-olive-500 dark:selection:text-black">
      <div className="w-full max-w-xl">
        <div className="space-y-20">
          <header className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase text-sky-900 dark:text-olive-100">RECUPERAR</h1>
            <div className="w-24 h-3 bg-sky-500 dark:bg-olive-400"></div>
          </header>

          {message ? (
            <div className="space-y-12">
              <div className="p-10 border-4 border-sky-500 dark:border-olive-400 rounded-3xl bg-white dark:bg-olive-900/10">
                <p className="text-xl font-black uppercase tracking-tight leading-tight text-sky-900 dark:text-olive-100">{message}</p>
              </div>
              <Link href="/admin/login" className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-sky-700 dark:text-olive-300 hover:text-sky-950 dark:hover:text-white hover:scale-110 transition-all">
                ← Volver al Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-650 dark:text-olive-400">Ingrese su email para recuperar acceso</p>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border-b-2 border-sky-200 dark:border-olive-800/60 py-6 text-2xl font-bold focus:outline-none focus:border-sky-500 dark:focus:border-olive-400 transition-all placeholder:text-sky-300 dark:placeholder:text-olive-700 text-sky-900 dark:text-olive-100 uppercase"
                    placeholder="ADMIN@ELDENT.COM"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-8 bg-sky-600 hover:bg-sky-700 dark:bg-olive-600 dark:hover:bg-olive-700 text-white text-xl font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-sky-200 dark:shadow-olive-900/30 rounded-2xl"
                >
                  {loading ? 'ENVIANDO...' : 'REESTABLECER CLAVE'}
                </button>
                <Link href="/admin/login" className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400 hover:text-sky-950 dark:hover:text-white transition-all">
                  CANCELAR
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
