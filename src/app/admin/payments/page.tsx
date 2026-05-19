'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface Payment {
  id: number;
  user_name: string;
  service_name: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  notes: string;
}

interface PersonnelPayment {
  id: number;
  personnel_name: string;
  amount: number;
  payment_type: string;
  payment_date: string;
  notes: string;
}

interface Personnel {
  id: number;
  name: string;
}

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [personnelPayments, setPersonnelPayments] = useState<PersonnelPayment[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    personnelId: '',
    amount: '',
    type: 'salary',
    notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'income') {
        const res = await fetch('/api/admin/payments');
        const data = await res.json();
        setPayments(data);
      } else {
        const res = await fetch('/api/admin/personnel-payments');
        const data = await res.json();
        setPersonnelPayments(data);
        
        if (personnel.length === 0) {
          const pRes = await fetch('/api/admin/personnel');
          const pData = await pRes.json();
          setPersonnel(pData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const totalIncome = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const totalExpenses = personnelPayments.reduce((acc, p) => acc + Number(p.amount), 0);
  const currentBalance = totalIncome - totalExpenses;

  const handleRecordPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const amountToPay = Number(formData.amount);
    
    if (amountToPay <= 0) {
      setError('EL MONTO DEBE SER MAYOR A 0');
      return;
    }

    if (amountToPay > currentBalance) {
      setError(`FONDOS INSUFICIENTES. BALANCE: S/. ${currentBalance.toFixed(2)}`);
      return;
    }

    try {
      const res = await fetch('/api/admin/personnel-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
        setFormData({ personnelId: '', amount: '', type: 'salary', notes: '' });
      } else {
        setError('ERROR AL PROCESAR EL PAGO');
      }
    } catch (error) {
      setError('ERROR DE CONEXIÓN CON EL SERVIDOR');
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase text-sky-900 dark:text-olive-100">FINANZAS</h1>
            <div className="w-20 h-2 bg-sky-500 dark:bg-olive-400"></div>
          </div>
          
          <div className="flex items-center gap-6">
            {activeTab === 'expenses' && (
              <button
                onClick={() => setShowModal(true)}
                className="p-6 bg-sky-600 dark:bg-olive-600 text-white rounded-full hover:scale-110 transition-all shadow-xl"
              >
                <AddIcon />
              </button>
            )}
            <div className="flex gap-px bg-sky-100 dark:bg-olive-900/30 border border-sky-200 dark:border-olive-800/20 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveTab('income')}
                className={`px-10 py-6 text-xs font-black uppercase tracking-[0.4em] transition-all ${
                  activeTab === 'income' ? 'bg-sky-600 dark:bg-olive-600 text-white' : 'bg-white dark:bg-olive-950 text-sky-700 dark:text-olive-300 hover:bg-sky-50 dark:hover:bg-olive-900/25'
                }`}
              >
                INGRESOS
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-10 py-6 text-xs font-black uppercase tracking-[0.4em] transition-all ${
                  activeTab === 'expenses' ? 'bg-sky-600 dark:bg-olive-600 text-white' : 'bg-white dark:bg-olive-950 text-sky-700 dark:text-olive-300 hover:bg-sky-50 dark:hover:bg-olive-900/25'
                }`}
              >
                EGRESOS
              </button>
            </div>
          </div>
        </header>

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-black w-full max-w-xl p-12 space-y-12 border-2 border-black dark:border-white shadow-2xl">
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter uppercase">Pago a Personal</h2>
                <div className="w-12 h-1 bg-black dark:bg-white"></div>
              </div>

              {error && (
                <div className="bg-red-500 text-white p-6 flex items-center gap-6 animate-in slide-in-from-left duration-300">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-black">!</div>
                  <p className="text-xs font-black uppercase tracking-[0.2em]">{error}</p>
                </div>
              )}

              <form onSubmit={handleRecordPayroll} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Seleccionar Profesional</label>
                  <select
                    required
                    value={formData.personnelId}
                    onChange={(e) => setFormData({ ...formData, personnelId: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none appearance-none uppercase text-black dark:text-white"
                  >
                    <option value="" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Elegir...</option>
                    {personnel.map(p => (
                      <option key={p.id} value={p.id} className="bg-white dark:bg-neutral-900 text-black dark:text-white">{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Monto (S/.)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none text-black dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Tipo</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none appearance-none uppercase text-black dark:text-white"
                    >
                      <option value="salary" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Sueldo</option>
                      <option value="bonus" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Bono</option>
                      <option value="commission" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Comisión</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Notas</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-neutral-100 dark:border-neutral-900 py-4 text-xl font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all rounded-none uppercase"
                    placeholder="E.G. PAGO MAYO"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-6 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all"
                  >
                    Registrar Pago
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-6 border-2 border-black dark:border-white text-xs font-black uppercase tracking-[0.4em] hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="p-10 bg-white dark:bg-olive-950 border border-sky-200 dark:border-olive-800/40 rounded-3xl shadow-xl space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 dark:text-olive-400">Balance Total</p>
            <p className="text-6xl font-black tracking-tighter text-sky-900 dark:text-olive-100">
              S/. {(totalIncome - totalExpenses).toLocaleString()}
            </p>
          </div>
          <div className="p-10 bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/20 rounded-3xl shadow-md space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">Total Ingresos</p>
            <p className="text-4xl font-black tracking-tighter text-green-600 dark:text-green-400">
              + S/. {totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="p-10 bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/20 rounded-3xl shadow-md space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Total Egresos</p>
            <p className="text-4xl font-black tracking-tighter text-red-600 dark:text-red-400">
              - S/. {totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 animate-pulse">
            <div className="w-10 h-1 bg-sky-500 dark:bg-olive-400 mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sincronizando transacciones...</p>
          </div>
        ) : (
          <div className="space-y-px bg-sky-100 dark:bg-olive-900/30 rounded-2xl overflow-hidden border border-sky-200 dark:border-olive-800/20">
            {activeTab === 'income' ? (
              payments.map((p) => (
                <div key={p.id} className="bg-white dark:bg-olive-950 p-8 flex flex-col md:flex-row md:items-center justify-between gap-12 group hover:bg-sky-50 dark:hover:bg-olive-900/20 transition-all border-b border-sky-100 dark:border-olive-900/30 last:border-b-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">ID #{p.id}</span>
                      <span className="px-3 py-1 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/20 text-[8px] font-black uppercase tracking-widest rounded-full">{p.payment_method}</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-sky-900 dark:text-olive-100">{p.user_name}</h3>
                    <p className="text-xs font-bold text-neutral-500 dark:text-olive-400 uppercase tracking-widest">{p.service_name}</p>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <p className="text-4xl font-black text-green-600">+ S/. {Number(p.amount).toFixed(2)}</p>
                    <p className="text-[10px] font-black uppercase text-neutral-400">
                      {new Date(p.payment_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              personnelPayments.map((p) => (
                <div key={p.id} className="bg-white dark:bg-olive-950 p-8 flex flex-col md:flex-row md:items-center justify-between gap-12 group hover:bg-sky-50 dark:hover:bg-olive-900/20 transition-all border-b border-sky-100 dark:border-olive-900/30 last:border-b-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">PAGO PERSONAL #{p.id}</span>
                      <span className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/20 text-[8px] font-black uppercase tracking-widest rounded-full">{p.payment_type}</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-sky-900 dark:text-olive-100">{p.personnel_name}</h3>
                    {p.notes && <p className="text-xs font-bold text-neutral-500 dark:text-olive-400 uppercase tracking-widest">{p.notes}</p>}
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <p className="text-4xl font-black text-red-600">- S/. {Number(p.amount).toFixed(2)}</p>
                    <p className="text-[10px] font-black uppercase text-neutral-400">
                      {new Date(p.payment_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {((activeTab === 'income' && payments.length === 0) || (activeTab === 'expenses' && personnelPayments.length === 0)) && (
              <div className="bg-white dark:bg-olive-950 py-32 text-center border-t border-sky-200 dark:border-olive-800/20">
                <p className="text-2xl font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">No hay transacciones registradas</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
