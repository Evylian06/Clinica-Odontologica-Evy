'use client';

import { useRouter } from 'next/navigation';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import Link from 'next/link';
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

export default function AdminSettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <AdminDashboardLayout>
      <div className="w-full space-y-24">
        <header className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">Ajustes</h1>
          <div className="w-20 h-2 bg-black dark:bg-white"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Session Control</h2>
            <button
              onClick={handleLogout}
              className="group flex items-center justify-between p-12 bg-black dark:bg-white text-white dark:text-black w-full hover:opacity-90 transition-all"
            >
              <span className="text-xl font-black uppercase tracking-[0.4em]">Terminate Session</span>
              <div className="w-12 h-12 rounded-full border-2 border-white/20 dark:border-black/20 flex items-center justify-center">→</div>
            </button>
          </div>

          <div className="space-y-12">
            <h2 className="text-3xl font-black tracking-tighter uppercase">System Info</h2>
            <div className="space-y-px bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900/50">
              {[
                { label: 'Version', value: '1.0.0' },
                { label: 'Environment', value: 'PRODUCTION' },
                { label: 'Architecture', value: 'MYSQL / NEXTJS' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-black p-8 flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">{item.label}</p>
                  <p className="text-sm font-black tracking-widest text-black dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-100 dark:bg-neutral-900/50 border-y border-neutral-100 dark:border-neutral-900/50">
              {[
                { name: 'Staff Management', href: '/admin/personnel' },
                { name: 'Services Control', href: '/admin/services' },
                { name: 'Intelligence Reports', href: '/admin/reports' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="bg-white dark:bg-black p-12 flex flex-col space-y-8 hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-all group"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">Access</p>
                  <p className="text-xl font-black uppercase tracking-tight group-hover:underline decoration-4 text-black dark:text-white">{action.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <footer className="pt-24 border-t border-neutral-100 dark:border-neutral-900 flex justify-between items-end">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">© 2026 ELDENT</p>
            <p className="text-[8px] font-bold opacity-30">ALL RIGHTS RESERVED — SECURE SYSTEM</p>
          </div>
          <div className="w-12 h-12 bg-black dark:bg-white"></div>
        </footer>
      </div>
    </AdminDashboardLayout>
  );
}
