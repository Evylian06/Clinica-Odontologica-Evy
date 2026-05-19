'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import {
  AttachMoney as MoneyIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

export default function AdminReportsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const cancellationRate = stats.completedAppointments > 0
    ? ((stats.cancelledAppointments / (stats.completedAppointments + stats.cancelledAppointments)) * 100).toFixed(1)
    : '0';

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        <header className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">REPORTES</h1>
          <div className="w-20 h-2 bg-black dark:bg-white"></div>
        </header>

        {loading ? (
          <div className="py-20 animate-pulse">
            <div className="w-10 h-1 bg-black dark:bg-white mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Compilando datos...</p>
          </div>
        ) : (
          <div className="space-y-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100 dark:bg-neutral-900/50 border-y border-neutral-100 dark:border-neutral-900/50">
              {[
                { label: 'Ingresos Totales', value: `S/. ${Number(stats.totalRevenue).toFixed(2)}` },
                { label: 'Citas Completadas', value: stats.completedAppointments },
                { label: 'Citas Canceladas', value: stats.cancelledAppointments },
                { label: 'Tasa de Cancelación', value: `${cancellationRate}%` },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-black p-12 space-y-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-all duration-500">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                  <p className="text-5xl font-black tracking-tighter text-black dark:text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-black dark:bg-white p-20 text-white dark:text-black">
              <div className="space-y-8 max-w-2xl">
                <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Resumen Operativo</h2>
                <p className="text-lg font-medium opacity-60 leading-relaxed uppercase">
                  Los datos reflejan el rendimiento operativo en tiempo real. Las métricas de ingresos se consolidan en función de las transacciones confirmadas de los pacientes y los gastos de personal.
                </p>
                <div className="pt-12 border-t border-white/10 dark:border-black/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Última actualización: {new Date().toLocaleString('es-ES').toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
