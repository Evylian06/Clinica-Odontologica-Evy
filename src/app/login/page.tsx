'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) flex items-center justify-center px-6 py-12">
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 rounded-full p-3 bg-white/90 border border-[#bfdbfe] shadow-sm transition hover:scale-105"
        aria-label="Alternar tema"
      >
        {isDarkMode ? <LightModeIcon className="text-[#1F2937]" /> : <DarkModeIcon className="text-[#1F2937]" />}
      </button>

      <div className="w-full max-w-md rounded-3xl border border-[#60A5FA] bg-white shadow-2xl shadow-[rgba(59,130,246,0.24)]">
        <div className="px-10 py-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-[#475569]">Clínica Dental</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-[#1F2937]">Ingreso seguro</h1>
            <p className="mt-3 text-sm leading-6 text-[#475569]">
              Accede a tu cuenta de paciente y administra tus citas de forma profesional.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#1F2937]">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-[#bfdbfe] bg-[#F0F9FF] px-4 py-3 text-base text-[#1F2937] outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-[#bfdbfe]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#1F2937]">
                Contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-[#bfdbfe] bg-[#F0F9FF] px-4 py-3 text-base text-[#1F2937] outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-[#bfdbfe]"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-(--primary) px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-(--primary-soft) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Procesando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-sm text-[#475569]">
            <p>¿No tienes cuenta?</p>
            <Link href="/register" className="font-semibold text-(--primary) hover:text-(--primary-soft)">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
