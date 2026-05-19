'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import {
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  MedicalServices as ServicesIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  DoneAll as DoneAllIcon,
  FilterList as FilterIcon,
  Payments as PaymentsIcon,
} from '@mui/icons-material';

interface Appointment {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  service_id: number;
  service_name: string;
  personnel_id: number;
  personnel_name: string;
  appointment_date: string;
  status: string;
  notes: string;
  price: number;
}

interface Service { id: number; name: string; price: number; }
interface Personnel { id: number; name: string; }

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; appointment: Appointment | null }>({ show: false, appointment: null });
  const [editModal, setEditModal] = useState<{ show: boolean; appointment: Appointment | null }>({ show: false, appointment: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const fetchDependencies = async () => {
    try {
      const [sRes, pRes] = await Promise.all([
        fetch('/api/admin/services'),
        fetch('/api/admin/personnel')
      ]);
      const [sData, pData] = await Promise.all([sRes.json(), pRes.json()]);
      setServices(Array.isArray(sData) ? sData : []);
      setPersonnel(Array.isArray(pData) ? pData : []);
    } catch (error) {
      console.error('Error fetching dependencies:', error);
      setServices([]);
      setPersonnel([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchAppointments();
      setSuccessMessage(`ESTADO ACTUALIZADO: ${status.toUpperCase()}`);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm({ show: false, id: null });
        fetchAppointments();
        setSuccessMessage('CITA ELIMINADA');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.appointment || submitting) return;
    setSubmitting(true);

    try {
      // Format date for MySQL (remove timezone and format properly)
      const dateObj = new Date(editModal.appointment.appointment_date);
      const formattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');

      const res = await fetch(`/api/admin/appointments/${editModal.appointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment_date: formattedDate,
          service_id: editModal.appointment.service_id,
          personnel_id: editModal.appointment.personnel_id,
          notes: editModal.appointment.notes,
          status: editModal.appointment.status
        }),
      });
      if (res.ok) {
        setEditModal({ show: false, appointment: null });
        await fetchAppointments();
        setSuccessMessage('CITA ACTUALIZADA EXITOSAMENTE');
      } else {
        const errorData = await res.json();
        setErrorMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error editing appointment:', error);
      setErrorMessage('Error de conexión al guardar la cita');
    } finally {
      setSubmitting(false);
    }
  };

  const recordPayment = async (apt: Appointment) => {
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: apt.id,
          userId: apt.user_id,
          amount: apt.price,
          method: 'cash',
          notes: `PAGO POR ${apt.service_name.toUpperCase()}`
        }),
      });
      
      if (res.ok) {
        setConfirmDialog({ show: false, appointment: null });
        fetchAppointments();
        setSuccessMessage('PAGO REGISTRADO Y CITA FINALIZADA');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'completed': return 'bg-green-50 text-green-600 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        {/* Success Notification */}
        {successMessage && (
          <div className="fixed top-20 right-4 left-4 md:left-auto md:right-12 z-[100] bg-black dark:bg-white text-white dark:text-black p-4 md:p-8 shadow-2xl border-l-8 border-green-500 animate-in slide-in-from-right duration-500">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">{successMessage}</p>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="fixed top-20 right-4 left-4 md:left-auto md:right-12 z-[100] bg-red-600 text-white p-4 md:p-8 shadow-2xl border-l-8 border-red-800 animate-in slide-in-from-right duration-500">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">{errorMessage}</p>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {confirmDialog.show && confirmDialog.appointment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-black w-full max-w-xl p-8 md:p-16 space-y-8 md:space-y-12 border-2 border-black dark:border-white shadow-2xl">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Confirmar Cobro</h2>
                <div className="w-12 md:w-16 h-1 bg-black dark:bg-white"></div>
              </div>
              
              <div className="space-y-6 md:space-y-8 py-6 md:py-8 border-y border-neutral-100 dark:border-neutral-900">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Paciente</p>
                  <p className="text-xl md:text-2xl font-bold uppercase">{confirmDialog.appointment.user_name}</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Monto a Cobrar</p>
                  <p className="text-3xl md:text-5xl font-black tracking-tighter">S/. {confirmDialog.appointment.price}</p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={() => recordPayment(confirmDialog.appointment!)}
                  className="flex-1 py-6 md:py-10 bg-black dark:bg-white text-white dark:text-black text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:opacity-80 transition-all"
                >
                  Confirmar Pago
                </button>
                <button
                  onClick={() => setConfirmDialog({ show: false, appointment: null })}
                  className="flex-1 py-6 md:py-10 border-2 border-black dark:border-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-black w-full max-w-md p-8 md:p-12 space-y-8 md:space-y-12 border-2 border-black dark:border-white shadow-2xl">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none text-red-600">Eliminar Cita</h2>
                <p className="text-xs md:text-sm font-medium opacity-60 uppercase tracking-widest">¿Estás seguro de que deseas eliminar esta cita permanentemente?</p>
              </div>
              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={() => handleDelete(deleteConfirm.id!)}
                  className="flex-1 py-4 md:py-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:opacity-80 transition-all"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: null })}
                  className="flex-1 py-4 md:py-6 border-2 border-black dark:border-white text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-neutral-50 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Appointment Modal */}
        {editModal.show && editModal.appointment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white dark:bg-black w-full max-w-2xl p-8 md:p-16 space-y-8 md:space-y-12 border-2 border-black dark:border-white shadow-2xl my-auto">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Editar Cita</h2>
                <div className="w-12 md:w-16 h-1 bg-black dark:bg-white"></div>
              </div>

              <form onSubmit={handleEdit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Servicio</label>
                    <select
                      required
                      value={editModal.appointment.service_id}
                      onChange={(e) => setEditModal({ ...editModal, appointment: { ...editModal.appointment!, service_id: Number(e.target.value) } })}
                      className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none appearance-none uppercase text-black dark:text-white"
                    >
                      {services.map(s => <option key={s.id} value={s.id} className="bg-white dark:bg-neutral-900 text-black dark:text-white">{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Especialista</label>
                    <select
                      required
                      value={editModal.appointment.personnel_id}
                      onChange={(e) => setEditModal({ ...editModal, appointment: { ...editModal.appointment!, personnel_id: Number(e.target.value) } })}
                      className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none appearance-none uppercase text-black dark:text-white"
                    >
                      {personnel.map(p => <option key={p.id} value={p.id} className="bg-white dark:bg-neutral-900 text-black dark:text-white">{p.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Fecha y Hora</label>
                  <input
                    required
                    type="datetime-local"
                    value={new Date(editModal.appointment.appointment_date).toISOString().slice(0, 16)}
                    onChange={(e) => setEditModal({ ...editModal, appointment: { ...editModal.appointment!, appointment_date: e.target.value } })}
                    className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-3 md:py-4 text-lg md:text-xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Notas</label>
                  <textarea
                    value={editModal.appointment.notes}
                    onChange={(e) => setEditModal({ ...editModal, appointment: { ...editModal.appointment!, notes: e.target.value } })}
                    className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-3 md:py-4 text-base md:text-lg font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase min-h-[80px] md:min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3 md:gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 py-5 md:py-8 text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all ${submitting ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'}`}
                  >
                    {submitting ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditModal({ show: false, appointment: null })}
                    className="flex-1 py-5 md:py-8 border-2 border-black dark:border-white text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-neutral-50 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-none uppercase text-sky-900 dark:text-olive-100">CITAS</h1>
            <div className="w-16 md:w-20 h-2 bg-sky-500 dark:bg-olive-400"></div>
          </div>
          
          <div className="flex gap-px bg-sky-100 dark:bg-olive-900/30 border border-sky-200 dark:border-olive-800/20 overflow-x-auto w-full md:w-auto rounded-xl">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled')}
                className={`px-4 md:px-8 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] whitespace-nowrap transition-all flex-1 md:flex-none ${
                  filter === f ? 'bg-sky-600 dark:bg-olive-600 text-white' : 'bg-white dark:bg-olive-950 text-sky-700 dark:text-olive-300 hover:bg-sky-50 dark:hover:bg-olive-900/25'
                }`}
              >
                {f === 'all' ? 'TODAS' : f.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="py-12 md:py-20 animate-pulse">
            <div className="w-8 md:w-10 h-1 bg-sky-500 dark:bg-olive-400 mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sincronizando registros...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-12 md:py-20 border-t-2 border-sky-500 dark:border-olive-400">
            <p className="text-xl md:text-2xl font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">No hay citas en esta categoría</p>
          </div>
        ) : (
          <div className="space-y-px bg-sky-100 dark:bg-olive-900/30 rounded-2xl overflow-hidden border border-sky-200 dark:border-olive-800/20">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="group relative bg-white dark:bg-olive-950 p-6 md:p-8 lg:p-16 flex flex-col gap-8 md:gap-12 lg:gap-16 transition-all duration-700 hover:bg-sky-50 dark:hover:bg-olive-900/20 border-b border-sky-100 dark:border-olive-900/30 last:border-b-0"
              >
                <div className="space-y-6 md:space-y-12 flex-1">
                  <div className="flex items-center gap-4 md:gap-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">ID: #{apt.id}</span>
                    <span className={`px-3 md:px-4 py-1 border-2 text-[8px] md:text-[8px] font-black uppercase tracking-widest ${getStatusColor(apt.status)}`}>
                      {getStatusLabel(apt.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
                    <div className="space-y-3 md:space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Paciente</p>
                      <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter uppercase">{apt.user_name}</h3>
                        <p className="text-xs font-bold text-neutral-400">{apt.user_email}</p>
                      </div>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Servicio / Especialista</p>
                      <div className="space-y-1">
                        <p className="font-black text-lg md:text-xl lg:text-2xl uppercase">{apt.service_name}</p>
                        <p className="text-xs md:text-sm font-bold text-neutral-500 uppercase">DR. {apt.personnel_name}</p>
                      </div>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Fecha y Hora</p>
                      <div className="space-y-1">
                        <p className="font-black text-lg md:text-xl lg:text-2xl uppercase">
                          {new Date(apt.appointment_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}
                        </p>
                        <p className="text-xs md:text-sm font-bold text-neutral-500">
                          {new Date(apt.appointment_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {apt.notes && (
                    <div className="p-4 md:p-8 bg-sky-50 dark:bg-olive-900/40 border-l-4 border-sky-500 dark:border-olive-400 rounded-r-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400 mb-2">Notas del Paciente</p>
                      <p className="text-base md:text-lg font-medium italic opacity-85 uppercase">&quot;{apt.notes}&quot;</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 md:gap-4">
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(apt.id, 'confirmed')}
                      className="w-full py-4 md:py-6 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                    >
                      Confirmar Cita
                    </button>
                  )}
                  
                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <>
                      <button
                        onClick={() => setConfirmDialog({ show: true, appointment: apt })}
                        className="w-full py-4 md:py-6 border-4 border-green-600 text-green-600 text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2 md:gap-3"
                      >
                        <PaymentsIcon /> Cobrar S/. {apt.price}
                      </button>
                      <button
                        onClick={() => updateStatus(apt.id, 'cancelled')}
                        className="w-full py-4 md:py-6 border-2 border-neutral-100 dark:border-neutral-900 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] hover:border-red-500 hover:text-red-500 transition-all"
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {apt.status === 'completed' && (
                    <div className="py-4 md:py-6 px-6 md:px-8 border-2 border-green-100 dark:border-green-900/30 text-center bg-green-50/30">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600">Servicio Pagado</span>
                    </div>
                  )}

                  {apt.status === 'cancelled' && (
                    <div className="py-4 md:py-6 px-6 md:px-8 border-2 border-red-100 dark:border-red-900/30 text-center bg-red-50/30">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">Cita Cancelada</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 md:gap-4 mt-2 md:mt-4">
                    <button
                      onClick={() => setEditModal({ show: true, appointment: apt })}
                      className="py-3 md:py-4 border-2 border-sky-200 dark:border-olive-700 text-sky-850 dark:text-olive-200 text-[8px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white dark:hover:bg-olive-600 dark:hover:text-white hover:border-sky-500 dark:hover:border-olive-600 transition-all rounded-xl"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ show: true, id: apt.id })}
                      className="py-3 md:py-4 border-2 border-red-200 dark:border-red-900/30 text-red-500 text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all rounded-xl"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
