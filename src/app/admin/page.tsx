'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import Link from 'next/link';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalUsers: 0,
    totalPersonnel: 0,
    totalServices: 0,
    todayAppointments: 0,
  });

  const [admin, setAdmin] = useState<any>({});
  const { enableNotifications, permission, mounted } = usePushNotifications(admin.id || null, true);

  const handleEnableNotifications = async () => {
    await enableNotifications();
  };

  const fetchStats = async () => {
    try {
      const [appointmentsRes, usersRes, personnelRes, servicesRes] = await Promise.all([
        fetch('/api/admin/stats/appointments'),
        fetch('/api/admin/stats/users'),
        fetch('/api/admin/stats/personnel'),
        fetch('/api/admin/stats/services'),
      ]);

      const appointments = await appointmentsRes.json();
      const users = await usersRes.json();
      const personnel = await personnelRes.json();
      const services = await servicesRes.json();

      setStats({
        totalAppointments: appointments.total || 0,
        pendingAppointments: appointments.pending || 0,
        totalUsers: users.total || 0,
        totalPersonnel: personnel.total || 0,
        totalServices: services.total || 0,
        todayAppointments: appointments.today || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const adminData = localStorage.getItem('admin');
        if (adminData && adminData !== 'undefined') {
          setAdmin(JSON.parse(adminData));
        }
      } catch (e) {
        console.error('Error parsing admin storage:', e);
      }
    }
    fetchStats();
  }, []);

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        {mounted && permission === 'default' && (
          <div className="p-6 bg-sky-100 dark:bg-olive-900/30 border-2 border-sky-300 dark:border-olive-600 rounded-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-sky-900 dark:text-olive-100 mb-2">
                  Habilitar Notificaciones
                </p>
                <p className="text-xs text-sky-700 dark:text-olive-300">
                  Recibe alertas sobre nuevas citas y actualizaciones en tiempo real
                </p>
              </div>
              <button
                onClick={handleEnableNotifications}
                className="px-6 py-3 bg-sky-600 dark:bg-olive-600 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-sky-700 dark:hover:bg-olive-700 transition-all"
              >
                Habilitar
              </button>
            </div>
          </div>
        )}

        <header className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase text-sky-900 dark:text-olive-100">ADMINISTRADOR</h1>
          <div className="w-20 h-2 bg-sky-500 dark:bg-olive-400"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-sky-200 dark:bg-olive-800/50 border-y border-sky-200 dark:border-olive-800/50">
          {[
            { label: 'Total Citas', value: stats.totalAppointments },
            { label: 'Pendientes', value: stats.pendingAppointments },
            { label: 'Hoy', value: stats.todayAppointments },
            { label: 'Pacientes', value: stats.totalUsers },
            { label: 'Personal', value: stats.totalPersonnel },
            { label: 'Servicios', value: stats.totalServices },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-olive-950 p-6 md:p-12 space-y-4 hover:bg-sky-50 dark:hover:bg-olive-900/20 transition-all duration-500">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400">{stat.label}</p>
              <p className="text-6xl font-black tracking-tighter text-sky-900 dark:text-olive-100">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-24">
          <div className="space-y-12">
            <h2 className="text-3xl font-black tracking-tighter uppercase text-sky-900 dark:text-olive-100">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Citas', href: '/admin/appointments' },
                { name: 'Pacientes', href: '/admin/patients' },
                { name: 'Personal', href: '/admin/personnel' },
                { name: 'Servicios', href: '/admin/services' },
                { name: 'Pagos', href: '/admin/payments' },
                { name: 'Reportes', href: '/admin/reports' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center justify-between p-8 border-2 border-sky-200 dark:border-olive-700 hover:border-sky-500 dark:hover:border-olive-400 transition-all duration-500"
                >
                  <span className="text-sm font-black uppercase tracking-[0.4em] text-sky-900 dark:text-olive-100">{action.name}</span>
                  <div className="w-10 h-10 rounded-full border-2 border-sky-200 dark:border-olive-700 flex items-center justify-center group-hover:border-sky-500 dark:group-hover:border-olive-400 transition-all text-sky-600 dark:text-olive-400">→</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-sky-600 dark:bg-olive-600 p-8 md:p-20 text-white dark:text-olive-100 flex flex-col justify-between space-y-20">
            <div className="space-y-6">
              <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Pendientes</h2>
              <p className="text-xl font-medium opacity-80">
                Hay {stats.pendingAppointments} citas esperando confirmación en el sistema.
              </p>
            </div>
            <Link
              href="/admin/appointments"
              className="inline-block py-6 md:py-8 px-8 md:px-12 border-2 border-white/30 dark:border-olive-200/30 text-sm font-black uppercase tracking-[0.4em] hover:bg-white dark:hover:bg-olive-200 hover:text-sky-600 dark:hover:text-olive-900 transition-all text-center"
            >
              Revisar Ahora
            </Link>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
