'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import {
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckIcon,
  Event as EventIcon,
  MedicalServices as ServicesIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

import { useState, useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface Appointment {
  id: number;
  service_name: string;
  personnel_name: string;
  appointment_date: string;
  status: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    next: '—',
  });
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>({});
  const { enableNotifications, permission, mounted } = usePushNotifications(user.id || null, false);

  const handleEnableNotifications = async () => {
    await enableNotifications();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        if (userData && userData !== 'undefined') {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Error parsing user storage:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!user.id) return;

    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`/api/appointments?userId=${user.id}`);
        const data = await res.json();
        const appointments: Appointment[] = Array.isArray(data) ? data : [];
        
        const pending = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
        const completed = appointments.filter(a => a.status === 'completed').length;
        
        const nextApp = appointments
          .filter(a => new Date(a.appointment_date) > new Date() && (a.status === 'pending' || a.status === 'confirmed'))
          .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())[0];

        setStats({
          pending,
          completed,
          next: nextApp ? new Date(nextApp.appointment_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '—',
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  return (
    <DashboardLayout>
      <div className="space-y-12 md:space-y-24">
        {mounted && permission === 'default' && (
          <div className="p-6 bg-sky-100 dark:bg-olive-900/30 border-2 border-sky-300 dark:border-olive-600 rounded-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-sky-900 dark:text-olive-100 mb-2">
                  Habilitar Notificaciones
                </p>
                <p className="text-xs text-sky-700 dark:text-olive-300">
                  Recibe alertas sobre tus citas confirmadas en tiempo real
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
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-sky-900 dark:text-olive-100">PANEL</h1>
          <div className="w-20 h-2 bg-sky-500 dark:bg-olive-400"></div>
        </header>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: 'Pendientes', value: stats.pending.toString(), icon: <CalendarIcon /> },
            { label: 'Completadas', value: stats.completed.toString(), icon: <CheckIcon /> },
            { label: 'Próxima', value: stats.next, icon: <EventIcon /> },
            { label: 'Servicios', value: '7', icon: <ServicesIcon />, active: true },
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`p-6 md:p-10 transition-all duration-500 ${
                stat.active 
                ? 'bg-sky-600 dark:bg-olive-600 text-white' 
                : 'bg-white dark:bg-olive-900/30 text-sky-900 dark:text-olive-100 hover:bg-sky-50 dark:hover:bg-olive-800/50'
              } ${loading ? 'animate-pulse' : ''}`}
            >
              <div className="flex flex-col gap-12">
                <div className="text-sm font-black uppercase tracking-[0.3em] opacity-40">{stat.label}</div>
                <p className="text-5xl md:text-7xl font-black tracking-tighter">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-sky-200 dark:bg-olive-800/50 overflow-hidden rounded-3xl md:rounded-[3rem] border border-sky-200 dark:border-olive-800/50">
          <div className="group relative p-8 md:p-16 bg-white dark:bg-olive-950 transition-all duration-500 hover:bg-sky-50 dark:hover:bg-olive-900/20">
            <h2 className="text-4xl font-black tracking-tighter mb-6 uppercase text-sky-900 dark:text-olive-100">Agendar</h2>
            <p className="text-sky-700 dark:text-olive-400 mb-12 text-lg leading-relaxed max-w-xs">
              Reserva un espacio con nuestros especialistas instantáneamente.
            </p>
            <Link
              href="/dashboard/appointments"
              className="inline-flex items-center gap-4 text-sm font-black uppercase tracking-widest text-sky-600 dark:text-olive-400 group-hover:gap-8 transition-all duration-500"
            >
              Comenzar <ArrowForwardIcon />
            </Link>
          </div>

          <div className="group relative p-8 md:p-16 bg-white dark:bg-olive-950 transition-all duration-500 hover:bg-sky-50 dark:hover:bg-olive-900/20">
            <h2 className="text-4xl font-black tracking-tighter mb-6 uppercase text-sky-900 dark:text-olive-100">Actividad</h2>
            <p className="text-sky-700 dark:text-olive-400 mb-12 text-lg leading-relaxed max-w-xs">
              Revisa tus tratamientos pasados y mantén el seguimiento.
            </p>
            <Link
              href="/dashboard/history"
              className="inline-flex items-center gap-4 text-sm font-black uppercase tracking-widest text-sky-600 dark:text-olive-400 group-hover:gap-8 transition-all duration-500"
            >
              Ver Historial <ArrowForwardIcon />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
