'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

interface Appointment {
  id: number;
  service_name: string;
  personnel_name: string;
  appointment_date: string;
  status: string;
  notes: string;
  price: number;
  is_paid: number;
}

export default function HistoryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData || userData === 'undefined') {
        setLoading(false);
        return;
      }
      let user;
      try {
        user = JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
        setLoading(false);
        return;
      }

      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/appointments?userId=${user.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAppointments(data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-24">
        <header className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase text-sky-900 dark:text-olive-100">HISTORIAL</h1>
          <div className="w-20 h-2 bg-sky-500 dark:bg-olive-400"></div>
        </header>

        {loading ? (
          <div className="py-20 animate-pulse">
            <div className="w-10 h-1 bg-black dark:bg-white mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Cargando datos...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="space-y-10">
            <p className="text-2xl font-medium text-neutral-400 dark:text-neutral-600">No hay registros aún.</p>
            <Link
              href="/dashboard/appointments"
              className="inline-block py-8 px-12 bg-black dark:bg-white text-white dark:text-black text-sm font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all"
            >
              Agendar Primera
            </Link>
          </div>
        ) : (
          <div className="space-y-px bg-sky-100 dark:bg-olive-900/30 rounded-2xl overflow-hidden border border-sky-200 dark:border-olive-800/20">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="group relative bg-white dark:bg-olive-950 p-6 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-12 transition-all duration-500 hover:bg-sky-50 dark:hover:bg-olive-900/20 border-b border-sky-100 dark:border-olive-900/30 last:border-b-0"
              >
                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">
                      {new Date(appointment.appointment_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-black dark:text-white">{appointment.service_name}</h3>
                  </div>
                  
                  <div className="flex gap-12">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Especialista</p>
                      <p className="font-bold text-sm uppercase text-black dark:text-white">{appointment.personnel_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Estado</p>
                      <p className={`font-black text-sm uppercase ${appointment.status === 'completed' ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-500'}`}>
                        {getStatusLabel(appointment.status)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Costo</p>
                      <p className="font-black text-sm uppercase text-black dark:text-white">S/. {appointment.price}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Pago</p>
                      <p className={`font-black text-[10px] uppercase px-3 py-1 border rounded-full ${
                        appointment.is_paid 
                          ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30' 
                          : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 opacity-70'
                      }`}>
                        {appointment.is_paid ? 'Pagado' : 'Pendiente'}
                      </p>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="pt-4 border-t border-neutral-50 dark:border-neutral-900">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 mb-1">Notas / Detalles</p>
                      <p className="text-sm italic text-neutral-600 dark:text-neutral-400 uppercase tracking-tight line-clamp-2">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-10">
                  {appointment.status === 'completed' ? (
                    <div className="w-16 h-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center font-black">✓</div>
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-neutral-100 dark:border-neutral-900 flex items-center justify-center text-neutral-200 dark:text-neutral-800 font-black">...</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
