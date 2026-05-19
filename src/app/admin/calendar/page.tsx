'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  MedicalServices as ServicesIcon,
} from '@mui/icons-material';

interface Appointment {
  id: number;
  user_name: string;
  service_name: string;
  personnel_name: string;
  appointment_date: string;
  status: string;
}

export default function AdminCalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments');
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

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(a => a.appointment_date.startsWith(dateStr));
  };

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const selectedDayAppointments = getAppointmentsForDate(selectedDate);

  return (
    <AdminDashboardLayout>
      <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-12 min-h-screen">
        <div className="xl:col-span-3 space-y-24">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">AGENDA</h1>
              <div className="w-20 h-2 bg-black dark:bg-white"></div>
            </div>
            <div className="flex items-center gap-px bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900/50">
              <button
                onClick={prevMonth}
                className="p-8 bg-white dark:bg-black hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all font-black text-xl text-black dark:text-white"
              >
                ←
              </button>
              <div className="px-12 py-8 bg-white dark:bg-black font-black uppercase tracking-[0.4em] text-black dark:text-white min-w-[250px] text-center">
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </div>
              <button
                onClick={nextMonth}
                className="p-8 bg-white dark:bg-black hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all font-black text-xl text-black dark:text-white"
              >
                →
              </button>
            </div>
          </header>

          {loading ? (
            <div className="py-20 animate-pulse">
              <div className="w-10 h-1 bg-black dark:bg-white mb-4"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sincronizando calendario...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-px bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900/50">
              {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(day => (
                <div key={day} className="bg-white dark:bg-black p-6 text-center text-[10px] font-black tracking-[0.4em] text-neutral-500 dark:text-neutral-400">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-neutral-50/50 dark:bg-neutral-950/50 min-h-[120px]"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                const dayAppointments = getAppointmentsForDate(date);
                const isSelected = selectedDate.toDateString() === date.toDateString();
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`relative p-8 min-h-[120px] transition-all group text-left ${
                      isSelected 
                        ? 'bg-black dark:bg-white text-white dark:text-black z-10' 
                        : 'bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/20'
                    }`}
                  >
                    <span className={`text-xl font-black tracking-tighter ${
                      isSelected ? '' : isToday ? 'underline decoration-4' : 'opacity-30'
                    }`}>
                      {day}
                    </span>
                    
                    {dayAppointments.length > 0 && !isSelected && (
                      <div className="mt-4 space-y-2">
                        <div className="w-6 h-1 bg-black dark:bg-white"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest">{dayAppointments.length} CITAS</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Details Panel */}
        <div className="xl:border-l xl:border-neutral-100 dark:xl:border-neutral-900 xl:pl-12 space-y-12 bg-neutral-50 dark:bg-neutral-950/50 p-12 xl:bg-transparent xl:p-0 xl:pt-24">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Detalles del Día</p>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-black dark:text-white">
              {selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}
            </h2>
          </div>

          <div className="space-y-6">
            {selectedDayAppointments.length === 0 ? (
              <div className="py-20 border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Sin citas para hoy</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayAppointments.sort((a, b) => a.appointment_date.localeCompare(b.appointment_date)).map((apt) => (
                  <div key={apt.id} className="p-8 bg-white dark:bg-black border border-neutral-100 dark:border-neutral-900 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black tracking-tighter">
                        {new Date(apt.appointment_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${
                        apt.status === 'pending' ? 'bg-yellow-500' : 
                        apt.status === 'confirmed' ? 'bg-black dark:bg-white' : 
                        apt.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Servicio</p>
                      <p className="font-bold text-lg leading-tight uppercase">{apt.service_name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Paciente</p>
                      <p className="font-bold uppercase">{apt.user_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
