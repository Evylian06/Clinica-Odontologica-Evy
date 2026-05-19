import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  MedicalServices as ServicesIcon,
  Payments as PaymentsIcon,
  Assessment as ReportsIcon,
  Event as EventIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

interface Admin {
  id: number;
  email: string;
  name: string;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin] = useState<Admin | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const adminData = localStorage.getItem('admin');
      if (adminData && adminData !== 'undefined') {
        return JSON.parse(adminData);
      }
    } catch {
      return null;
    }
    return null;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    router.push('/');
  };

  const navItems = [
    { name: 'Panel', href: '/admin', icon: <DashboardIcon /> },
    { name: 'Citas', href: '/admin/appointments', icon: <CalendarIcon /> },
    { name: 'Pacientes', href: '/admin/patients', icon: <PeopleIcon /> },
    { name: 'Personal', href: '/admin/personnel', icon: <PersonIcon /> },
    { name: 'Servicios', href: '/admin/services', icon: <ServicesIcon /> },
    { name: 'Pagos', href: '/admin/payments', icon: <PaymentsIcon /> },
    { name: 'Reportes', href: '/admin/reports', icon: <ReportsIcon /> },
    { name: 'Calendario', href: '/admin/calendar', icon: <EventIcon /> },
    { name: 'Seguridad', href: '/admin/manage-admins', icon: <SecurityIcon /> },
    { name: 'Perfil', href: '/admin/profile', icon: <ProfileIcon /> },
    { name: 'Configuración', href: '/admin/settings', icon: <SettingsIcon /> },
  ];

  const mobileNavItems = [
    { name: 'Panel', href: '/admin', icon: <DashboardIcon /> },
    { name: 'Citas', href: '/admin/appointments', icon: <CalendarIcon /> },
    { name: 'Pacientes', href: '/admin/patients', icon: <PeopleIcon /> },
    { name: 'Personal', href: '/admin/personnel', icon: <PersonIcon /> },
  ];

  const mobileMoreItems = [
    { name: 'Pagos', href: '/admin/payments', icon: <PaymentsIcon /> },
    { name: 'Perfil', href: '/admin/profile', icon: <ProfileIcon /> },
    { name: 'Configuración', href: '/admin/settings', icon: <SettingsIcon /> },
    { name: 'Calendario', href: '/admin/calendar', icon: <EventIcon /> },
    { name: 'Reportes', href: '/admin/reports', icon: <ReportsIcon /> },
  ];

  return (
    <div className="min-h-screen bg-(--background) dark:bg-slate-950 text-(--foreground) dark:text-slate-100 flex transition-colors duration-500">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-slate-950 transition-colors duration-500 border-r border-(--border) dark:border-slate-700">
        <div className="p-10">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-(--primary) dark:text-[#60A5FA]">Eldent</h1>
          <div className="w-10 h-1 bg-(--primary) dark:bg-[#60A5FA] mt-2"></div>
        </div>
        <nav className="flex-1 px-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-2 active:scale-95 ${
                    pathname === item.href
                      ? 'bg-(--primary) dark:bg-[#60A5FA] text-white shadow-lg shadow-[rgba(59,130,246,0.18)] scale-[1.02]'
                      : 'text-(--primary) dark:text-[#60A5FA] hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="scale-90">{item.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-(--primary) dark:text-[#60A5FA] hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 active:scale-95"
          >
            <LogoutIcon />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Salir</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 flex items-center gap-1">
        {/* Main Navigation Container */}
        <nav className="flex-1 bg-(--primary) dark:bg-[#60A5FA] backdrop-blur-xl rounded-[50px] shadow-2xl overflow-hidden border border-[#60A5FA]">
          <div className="flex justify-around items-center h-20 px-4">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center transition-all duration-300 ${
                  pathname === item.href
                    ? 'w-16 h-16 rounded-full bg-white dark:bg-slate-200 text-(--primary) dark:text-slate-950 scale-110 shadow-lg'
                    : 'text-white dark:text-slate-950'
                }`}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </nav>

        {/* More Button */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                dropdownOpen || mobileMoreItems.some((item) => pathname === item.href)
                  ? 'bg-(--primary) dark:bg-[#60A5FA] text-white scale-110 shadow-lg'
                  : 'bg-(--primary) dark:bg-[#60A5FA] text-white'
              }`}
            >
              <ExpandMoreIcon className={`transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* More Dropdown */}
            {dropdownOpen && (
              <div className="absolute bottom-20 right-0 w-64 bg-(--primary) dark:bg-[#60A5FA] rounded-[50px] shadow-2xl border border-[#60A5FA] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                <div className="p-4 space-y-2">
                  {mobileMoreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 p-4 rounded-[50px] transition-all ${
                        pathname === item.href
                          ? 'bg-white dark:bg-slate-200 text-(--primary) dark:text-slate-950'
                          : 'hover:bg-[#60A5FA] dark:hover:bg-slate-800 text-white dark:text-slate-950'
                      }`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>{item.icon}</span>
                      <span className="text-sm font-bold uppercase tracking-wider">{item.name}</span>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-32 md:pb-0 min-h-screen">
        <header className="px-6 md:px-10 py-10 flex items-center justify-between sticky top-0 z-40 bg-(--background)/80 dark:bg-slate-950/80 backdrop-blur-md transition-all duration-500">
          <div className="flex flex-col">
            <h1 className="text-xs font-black uppercase tracking-[0.4em] text-(--primary) dark:text-[#60A5FA]">Admin</h1>
            {admin && <span className="text-xl font-bold tracking-tight text-(--foreground) dark:text-slate-100">{admin.name}</span>}
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={toggleDarkMode}
              className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
              aria-label="Toggle Dark Mode"
            >
              <div className="relative z-10 text-(--primary) dark:text-[#60A5FA] transition-colors duration-500">
                {isDarkMode ? <LightModeIcon className="w-6! h-6!" /> : <DarkModeIcon className="w-6! h-6!" />}
              </div>
            </button>
          </div>
        </header>
        <div className="px-4 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
