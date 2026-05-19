import Link from 'next/link';

const features = [
  {
    title: 'Gestión de citas',
    description: 'Agenda y controla citas con un flujo claro para pacientes y doctores.',
  },
  {
    title: 'Historial clínico',
    description: 'Registra tratamientos, resultados y notas de cada visita para tus pacientes.',
  },
  {
    title: 'Panel administrativo',
    description: 'Un dashboard moderno para gestionar personal, servicios y reportes.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-[var(--primary)] shadow-lg shadow-[rgba(59,130,246,0.18)]" />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#475569]">Eldent</p>
              <p className="text-sm font-semibold text-[#1F2937]">Solución dental</p>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm font-semibold text-[#1F2937]">
            <Link href="/login" className="transition hover:text-[var(--primary)]">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[var(--primary)] px-5 py-3 text-white transition hover:bg-[var(--primary-soft)]"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[0.95fr,0.7fr] lg:items-center">
          <div className="space-y-8">
            <p className="text-sm uppercase tracking-[0.35em] text-[#475569]">Gestión clínica profesional</p>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-[#1F2937] sm:text-6xl">
              Software para clínicas dentales que necesitan precisión y control.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#475569]">
              Organiza citas, pacientes, servicios y pagos desde una interfaz limpia y corporativa. Reemplaza el logo del navegador cuando quieras y muestra tu marca con confianza.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-8 py-4 text-sm font-black text-white transition hover:bg-[var(--primary-soft)]"
              >
                Crear cuenta
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-8 py-4 text-sm font-semibold text-[#1F2937] transition hover:border-[#60A5FA]"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
          <div className="rounded-4xl border border-[var(--border)] bg-white p-10 shadow-xl shadow-[rgba(59,130,246,0.15)]">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-[#94a3b8]">Listo para tu clínica</p>
              <div className="space-y-4">
                <div className="rounded-3xl bg-[#F0F9FF] p-6">
                  <h2 className="text-xl font-semibold text-[#1F2937]">Panel de control</h2>
                  <p className="mt-2 text-[#475569]">Monitorea citas y actividad desde un dashboard claro.</p>
                </div>
                <div className="rounded-3xl bg-[#F0F9FF] p-6">
                  <h2 className="text-xl font-semibold text-[#1F2937]">Experiencia de paciente</h2>
                  <p className="mt-2 text-[#475569]">Registro simple y gestión de historial con seguridad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:pb-28">
        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[1.75rem] border border-[var(--border)] bg-white p-8 shadow-lg shadow-[rgba(59,130,246,0.12)]"
            >
              <h3 className="text-xl font-bold text-[#1F2937]">{feature.title}</h3>
              <p className="mt-4 text-[#475569]">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
