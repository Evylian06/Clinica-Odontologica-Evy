'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If admin is already logged in, redirect
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleFirstLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/register', {
        method: 'PUT', // Route checks if password matches or if they need to confirm
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      if (data.requiresConfirm) {
        localStorage.setItem('tempToken', data.token);
        localStorage.setItem('tempUser', JSON.stringify(data.user));
        setStep(2);
      } else {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('admin', JSON.stringify(data.user));
        router.push('/admin');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSecondLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const tempToken = localStorage.getItem('tempToken');
      const tempUserStr = localStorage.getItem('tempUser');

      if (!tempToken || !tempUserStr) {
        throw new Error('Sesión temporal expirada. Por favor intente de nuevo.');
      }

      const tempUser = JSON.parse(tempUserStr) as { id: number };

      const res = await fetch(`/api/admin/patients`, { // Overloaded route or security route to update password
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({
          adminId: tempUser.id,
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al verificar');
      }

      if (data.role !== 'admin') {
        throw new Error('Acceso no autorizado');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('admin', JSON.stringify(data.user));
      localStorage.removeItem('tempToken');
      localStorage.removeItem('tempUser');
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al verificar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-olive-950 text-sky-950 dark:text-olive-50 flex items-center justify-center px-6 transition-colors duration-500 selection:bg-sky-500 selection:text-white dark:selection:bg-olive-500 dark:selection:text-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-sky-900 dark:text-olive-100">Eldent</h1>
          <p className="text-sky-600 dark:text-olive-400 font-bold text-xs uppercase tracking-widest mt-2">
            {step === 1 ? 'Admin - Primera Autenticación' : 'Admin - Segunda Autenticación'}
          </p>
          <div className="w-12 h-1 bg-sky-500 dark:bg-olive-400 mx-auto mt-4"></div>
        </div>

        <form onSubmit={step === 1 ? handleFirstLogin : handleSecondLogin} className="space-y-6 bg-white dark:bg-olive-900/10 p-8 rounded-3xl border border-sky-200 dark:border-olive-800/40 shadow-xl">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border border-sky-200 dark:border-olive-800/60 focus:border-sky-500 dark:focus:border-olive-400 rounded-2xl focus:outline-none transition text-sky-900 dark:text-olive-100 placeholder:text-sky-300 dark:placeholder:text-olive-700"
              placeholder="admin@eldent.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border border-sky-200 dark:border-olive-800/60 focus:border-sky-500 dark:focus:border-olive-400 rounded-2xl focus:outline-none transition text-sky-900 dark:text-olive-100 placeholder:text-sky-300 dark:placeholder:text-olive-700"
              placeholder="••••••••"
            />
          </div>

          {step === 2 && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-transparent border border-sky-200 dark:border-olive-800/60 focus:border-sky-500 dark:focus:border-olive-400 rounded-2xl focus:outline-none transition text-sky-900 dark:text-olive-100 placeholder:text-sky-300 dark:placeholder:text-olive-700"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 dark:bg-olive-600 dark:hover:bg-olive-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition disabled:opacity-50 active:scale-98"
          >
            {loading ? 'Verificando...' : step === 1 ? 'Continuar' : 'Acceder al Panel'}
          </button>
        </form>

        <div className="mt-8 space-y-4 text-center">
          <Link href="/admin/register" className="block text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-olive-400 hover:text-sky-900 dark:hover:text-olive-200 transition-colors">
            Registrar nuevo administrador
          </Link>
          <Link 
            href="/admin/forgot-password"
            className="block w-full text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-olive-400 hover:text-sky-900 dark:hover:text-olive-200 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <div className="pt-8 border-t border-sky-200/50 dark:border-olive-800/30">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400 hover:text-sky-900 dark:hover:text-olive-200 transition-all">
              Volver a Login de Usuario
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
