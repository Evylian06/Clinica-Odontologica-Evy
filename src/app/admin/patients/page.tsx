'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  appointments_count: number;
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/admin/patients');
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const deletePatient = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este paciente? Se eliminarán todas sus citas.')) return;
    try {
      await fetch(`/api/admin/patients/${id}`, { method: 'DELETE' });
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">PACIENTES</h1>
            <div className="w-20 h-2 bg-black dark:bg-white"></div>
          </div>
          <div className="relative group flex-1 max-w-md">
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-black dark:text-white"
            />
          </div>
        </header>

        {loading ? (
          <div className="py-20 animate-pulse">
            <div className="w-10 h-1 bg-black dark:bg-white mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Fetching records...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="py-20">
            <p className="text-2xl font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">No patients found.</p>
          </div>
        ) : (
          <div className="space-y-px bg-neutral-100 dark:bg-neutral-900/50">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="group relative bg-white dark:bg-black p-6 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-12 transition-all duration-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/20"
              >
                <div className="space-y-8 flex-1">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">
                      ID: #{patient.id} — REG: {new Date(patient.created_at).toLocaleDateString('es-ES').toUpperCase()}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-tight group-hover:tracking-tight transition-all duration-500 text-black dark:text-white">{patient.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Email</p>
                      <p className="font-bold text-sm truncate max-w-[200px] text-black dark:text-white">{patient.email.toUpperCase()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Phone</p>
                      <p className="font-bold text-sm text-black dark:text-white">{(patient.phone || 'N/A').toUpperCase()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Activity</p>
                      <p className="font-black text-sm uppercase">{patient.appointments_count} CITAS</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <button
                    onClick={() => deletePatient(patient.id)}
                    className="group/btn relative px-8 py-4 border-2 border-red-500/10 text-red-500/30 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                  >
                    Delete
                  </button>
                  <div className="w-12 h-12 rounded-full border-2 border-neutral-100 dark:border-neutral-900 flex items-center justify-center font-black group-hover:border-black dark:group-hover:border-white transition-all duration-500">
                    →
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
