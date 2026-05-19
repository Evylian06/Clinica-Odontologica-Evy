'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface Personnel {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  available: boolean;
}

export default function AdminPersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '',
  });

  const fetchPersonnel = async () => {
    try {
      const res = await fetch('/api/admin/personnel');
      const data = await res.json();
      setPersonnel(data);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/personnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setShowAddForm(false);
      setFormData({ name: '', specialty: '', email: '', phone: '' });
      fetchPersonnel();
    } catch (error) {
      console.error('Error adding personnel:', error);
    }
  };

  const toggleAvailability = async (id: number, available: boolean) => {
    try {
      await fetch(`/api/admin/personnel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !available }),
      });
      fetchPersonnel();
    } catch (error) {
      console.error('Error updating personnel:', error);
    }
  };

  const deletePersonnel = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este miembro del personal?')) return;
    try {
      await fetch(`/api/admin/personnel/${id}`, { method: 'DELETE' });
      fetchPersonnel();
    } catch (error) {
      console.error('Error deleting personnel:', error);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">PERSONAL</h1>
            <div className="w-20 h-2 bg-black dark:bg-white"></div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="py-6 px-12 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all"
          >
            {showAddForm ? 'CANCELAR' : 'AGREGAR NUEVO'}
          </button>
        </header>

        {showAddForm && (
          <div className="py-20 border-y-2 border-black dark:border-white">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase text-black dark:text-white"
                  placeholder="NOMBRE DEL ESPECIALISTA"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Especialidad</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  required
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase text-black dark:text-white"
                  placeholder="EJ: ODONTOLOGÍA"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase text-black dark:text-white"
                  placeholder="EMAIL@ELDENT.COM"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase text-black dark:text-white"
                  placeholder="+51 ..."
                />
              </div>
              <div className="md:col-span-2 pt-12">
                <button
                  type="submit"
                  className="w-full py-10 bg-black dark:bg-white text-white dark:text-black text-xl font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="py-20 animate-pulse">
            <div className="w-10 h-1 bg-black dark:bg-white mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Cargando especialistas...</p>
          </div>
        ) : personnel.length === 0 ? (
          <div className="py-20">
            <p className="text-2xl font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">No hay especialistas registrados.</p>
          </div>
        ) : (
          <div className="space-y-px bg-neutral-100 dark:bg-neutral-900/50">
            {personnel.map((person) => (
              <div
                key={person.id}
                className="group relative bg-white dark:bg-black p-6 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-12 transition-all duration-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/20"
              >
                <div className="space-y-8 flex-1">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">
                      ID: #{person.id} — {person.available ? 'DISPONIBLE' : 'FUERA DE SERVICIO'}
                    </span>
                    <h3 className="text-5xl font-black tracking-tighter uppercase leading-tight group-hover:tracking-tight transition-all duration-500 text-black dark:text-white">{person.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Especialidad</p>
                      <p className="font-bold text-sm uppercase text-black dark:text-white">{person.specialty.toUpperCase()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Email</p>
                      <p className="font-bold text-sm text-black dark:text-white">{(person.email || 'N/A').toUpperCase()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Teléfono</p>
                      <p className="font-bold text-sm text-black dark:text-white">{(person.phone || 'N/A').toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <button
                    onClick={() => toggleAvailability(person.id, person.available)}
                    className="py-6 px-10 border-2 border-black dark:border-white text-black dark:text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                  >
                    {person.available ? 'DESACTIVAR' : 'ACTIVAR'}
                  </button>
                  <button
                    onClick={() => deletePersonnel(person.id)}
                    className="py-6 px-10 border-2 border-red-500/20 text-red-500/40 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
