'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import {
  MedicalServices as ServicesIcon,
  Description as DescriptionIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price),
        }),
      });
      setShowAddForm(false);
      setFormData({ name: '', description: '', duration: '', price: '' });
      fetchServices();
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">SERVICIOS</h1>
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
              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Nombre del Servicio</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-4xl font-black focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase text-black dark:text-white"
                  placeholder="NOMBRE DEL SERVICIO"
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase resize-none text-black dark:text-white"
                  placeholder="DESCRIBA BREVEMENTE EL SERVICIO..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Duración (MIN)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase text-black dark:text-white"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Precio (S/.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-2xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase text-black dark:text-white"
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
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Cargando servicios...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="py-20">
            <p className="text-2xl font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">No hay servicios registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-100 dark:bg-neutral-900/50">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white dark:bg-black p-8 md:p-16 space-y-12 transition-all duration-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/20"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">ID: #{service.id}</span>
                    <p className="text-4xl font-black text-black dark:text-white">S/. {Number(service.price).toFixed(2)}</p>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none group-hover:tracking-tight transition-all duration-500 text-black dark:text-white">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-500 uppercase leading-relaxed max-w-sm">
                      {service.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Duración</p>
                    <p className="font-black text-sm uppercase text-black dark:text-white">{service.duration} MIN</p>
                  </div>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="py-4 px-8 border-2 border-red-500/10 text-red-500/30 text-[8px] font-black uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
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
