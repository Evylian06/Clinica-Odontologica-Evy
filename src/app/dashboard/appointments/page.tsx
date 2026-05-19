'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface Personnel {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  available: boolean;
}

export default function AppointmentsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    personnelId: '',
    date: '',
    time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [viewDate, setViewDate] = useState(new Date());

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }, []);

  const fetchPersonnel = useCallback(async () => {
    try {
      const res = await fetch('/api/personnel');
      const data = await res.json();
      setPersonnel(data);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchPersonnel();
  }, [fetchServices, fetchPersonnel]);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      setMessage('Por favor seleccione fecha y hora');
      return;
    }
    setLoading(true);
    setMessage('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          serviceId: parseInt(formData.serviceId),
          personnelId: parseInt(formData.personnelId),
          appointmentDate: `${formData.date} ${formData.time}`,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al agendar cita');
      }

      setMessage('Cita agendada exitosamente');
      setFormData({ serviceId: '', personnelId: '', date: '', time: '', notes: '' });
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Error al agendar cita');
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <DashboardLayout>
      <div className="w-full space-y-24">
        <header className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase text-sky-900 dark:text-olive-100">RESERVAR</h1>
          <div className="w-24 h-3 bg-sky-500 dark:bg-olive-400"></div>
        </header>

        {message && (
          <div className="p-8 border border-sky-300 dark:border-olive-600 bg-sky-100/50 dark:bg-olive-900/30 rounded-2xl animate-in fade-in slide-in-from-top-4">
            <p className="font-black uppercase tracking-[0.2em] text-sm text-center text-sky-900 dark:text-olive-100">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Step 1: Selection */}
            <div className="space-y-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-700 dark:text-olive-400">01. Seleccionar Servicio</label>
                  <div className="grid grid-cols-1 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, serviceId: service.id.toString() })}
                        className={`p-8 text-left border rounded-2xl transition-all duration-300 ${
                          formData.serviceId === service.id.toString()
                            ? 'bg-sky-600 dark:bg-olive-600 text-white border-sky-600 dark:border-olive-600 shadow-xl'
                            : 'bg-white dark:bg-olive-950 border-sky-100 dark:border-olive-900/30 hover:border-sky-500 dark:hover:border-olive-500 text-sky-900 dark:text-olive-100'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-black tracking-tighter uppercase">{service.name}</span>
                          <span className="text-sm font-bold opacity-80">S/. {service.price}</span>
                        </div>
                        <p className={`text-xs uppercase tracking-widest leading-relaxed line-clamp-1 ${formData.serviceId === service.id.toString() ? 'text-sky-100' : 'text-sky-700/60 dark:text-olive-400/60'}`}>{service.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-700 dark:text-olive-400">02. Seleccionar Especialista</label>
                  <select
                    value={formData.personnelId}
                    onChange={(e) => setFormData({ ...formData, personnelId: e.target.value })}
                    required
                    className="w-full bg-transparent border-b-2 border-sky-200 dark:border-olive-800 py-6 text-2xl font-bold focus:outline-none focus:border-sky-500 dark:focus:border-olive-400 transition-all appearance-none cursor-pointer rounded-none text-sky-900 dark:text-olive-100 uppercase"
                  >
                    <option value="" className="bg-sky-50 dark:bg-olive-950">ELEGIR DOCTOR</option>
                    {personnel.map((person) => (
                      <option key={person.id} value={person.id} className="bg-sky-50 dark:bg-olive-950">
                        DR. {person.name.toUpperCase()} — {person.specialty.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-700 dark:text-olive-400">05. Notas Adicionales</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-transparent border-2 border-sky-100 dark:border-olive-800 p-8 text-xl font-bold focus:outline-none focus:border-sky-500 dark:focus:border-olive-400 transition-all resize-none rounded-2xl placeholder:text-sky-900/30 dark:placeholder:text-olive-100/30 text-sky-900 dark:text-olive-100 uppercase"
                  placeholder="INFORMACIÓN IMPORTANTE PARA EL DOCTOR..."
                />
              </div>
            </div>

            {/* Step 2: Calendar & Time */}
            <div className="space-y-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-700 dark:text-olive-400">03. Elegir Fecha</label>
                  <div className="border border-sky-200 dark:border-olive-800/40 rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-olive-950">
                    <div className="flex items-center justify-between p-6 bg-sky-50 dark:bg-olive-900/20 border-b border-sky-100 dark:border-olive-900/30">
                      <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="text-xl font-black px-4 hover:scale-125 transition-all text-sky-900 dark:text-olive-100">←</button>
                      <span className="text-sm font-black uppercase tracking-[0.4em] text-sky-900 dark:text-olive-100">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                      <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="text-xl font-black px-4 hover:scale-125 transition-all text-sky-900 dark:text-olive-100">→</button>
                    </div>
                    <div className="grid grid-cols-7 text-center">
                      {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                        <div key={`${d}-${i}`} className="py-4 text-[10px] font-black text-sky-700 dark:text-olive-400 border-b border-sky-50 dark:border-olive-900/30">{d}</div>
                      ))}
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-4 border-b border-r border-sky-50/50 dark:border-olive-900/10"></div>
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = formData.date === dateStr;
                        const isToday = new Date().toDateString() === date.toDateString();
                        const isPast = date < new Date(new Date().setHours(0,0,0,0));

                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={isPast}
                            onClick={() => setFormData({ ...formData, date: dateStr })}
                            className={`p-4 text-sm font-black border-b border-r border-sky-100 dark:border-olive-900/20 transition-all ${
                              isSelected 
                                ? 'bg-sky-600 dark:bg-olive-600 text-white border-transparent' 
                                : isPast 
                                  ? 'opacity-10 cursor-not-allowed text-sky-900 dark:text-olive-100 border-transparent' 
                                  : 'hover:bg-sky-50 dark:hover:bg-olive-900/30 text-sky-900 dark:text-olive-100 border-transparent'
                            } ${isToday && !isSelected ? 'text-sky-600 dark:text-olive-400 underline decoration-2' : ''}`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-700 dark:text-olive-400">04. Elegir Hora</label>
                  <div className="grid grid-cols-5 gap-4">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData({ ...formData, time: slot })}
                        className={`py-4 text-xs font-black border rounded-xl transition-all ${
                          formData.time === slot
                            ? 'bg-sky-600 dark:bg-olive-600 text-white border-sky-600 dark:border-olive-600 shadow-lg'
                            : 'bg-white dark:bg-olive-950 border-sky-100 dark:border-olive-900/30 hover:border-sky-500 dark:hover:border-olive-500 text-sky-900 dark:text-olive-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12">
            <button
              type="submit"
              disabled={loading || !formData.date || !formData.time || !formData.serviceId || !formData.personnelId}
              className="w-full py-8 bg-sky-600 dark:bg-olive-600 hover:bg-sky-700 dark:hover:bg-olive-700 text-white text-2xl font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none rounded-[50px] shadow-xl"
            >
              {loading ? 'PROCESANDO...' : 'CONFIRMAR CITA'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
