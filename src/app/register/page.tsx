'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-4xl border border-[#bfdbfe] bg-white shadow-2xl shadow-[rgba(59,130,246,0.18)]">
        <div className="grid gap-10 md:grid-cols-[1.15fr,0.85fr]">
          <div className="p-10">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#475569]">Registro</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#1F2937]">Crea tu cuenta</h1>
              <p className="mt-3 text-sm leading-6 text-[#475569]">
                Registra tus datos para gestionar citas y acceder a tu historial desde un entorno corporativo.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5">
                <label className="block text-sm font-semibold text-[#1F2937]">
                  Nombre completo
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    required
                    className="mt-2 w-full rounded-2xl border border-[#bfdbfe] bg-[#F0F9FF] px-4 py-3 text-base text-[#1F2937] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#bfdbfe]"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#1F2937]">
                  Email
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    required
                    className="mt-2 w-full rounded-2xl border border-[#bfdbfe] bg-[#F0F9FF] px-4 py-3 text-base text-[#1F2937] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#bfdbfe]"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#1F2937]">
                  Teléfono
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[#bfdbfe] bg-[#F0F9FF] px-4 py-3 text-base text-[#1F2937] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#bfdbfe]"
                  />
                </label>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-[#1F2937]">
                    Contraseña
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                      required
                      className="mt-2 w-full rounded-2xl border border-[#bfdbfe] bg-[#F0F9FF] px-4 py-3 text-base text-[#1F2937] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#bfdbfe]"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#1F2937]">
                    Confirmar contraseña
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                      required
                      className="mt-2 w-full rounded-2xl border border-[#bfdbfe] bg-[#F0F9FF] px-4 py-3 text-base text-[#1F2937] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#bfdbfe]"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[var(--primary)] px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-[var(--primary-soft)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Procesando...' : 'Crear cuenta'}
              </button>
            </form>
          </div>

          <div className="hidden rounded-r-4xl bg-[#1F2937] p-10 text-white md:block">
            <p className="text-xs uppercase tracking-[0.35em] text-[#60A5FA]">Bienvenido a Eldent</p>
            <h2 className="mt-4 text-3xl font-black">Software para clínicas dentales</h2>
            <p className="mt-4 text-[#cbd5e1] leading-7">
              Un entorno organizado, seguro y corporativo para gestionar citas, pacientes y reportes.
            </p>
          </div>
        </div>

        <div className="border-t border-[#bfdbfe] px-10 py-6 text-center text-sm text-[#475569]">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-soft)]">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
