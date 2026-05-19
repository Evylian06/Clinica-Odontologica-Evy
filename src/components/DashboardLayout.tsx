import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined') {
        return JSON.parse(userData);
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
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const navItems = [
    { name: 'Panel', href: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Citas', href: '/dashboard/appointments', icon: <CalendarIcon /> },
    { name: 'Historial', href: '/dashboard/history', icon: <HistoryIcon /> },
    { name: 'Perfil', href: '/dashboard/profile', icon: <ProfileIcon /> },
    { name: 'Configuración', href: '/dashboard/settings', icon: <SettingsIcon /> },
  ];

  const mobileNavItems = [
    { name: 'Panel', href: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Citas', href: '/dashboard/appointments', icon: <CalendarIcon /> },
    { name: 'Historial', href: '/dashboard/history', icon: <HistoryIcon /> },
  ];

  const mobileMoreItems = [
    { name: 'Perfil', href: '/dashboard/profile', icon: <ProfileIcon /> },
    { name: 'Configuración', href: '/dashboard/settings', icon: <SettingsIcon /> },
  ];

  return (
    <div className="min-h-screen bg-(--background) dark:bg-slate-950 text-(--foreground) dark:text-slate-100 flex transition-colors duration-500">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-slate-950 transition-colors duration-500 border-r border-(--border) dark:border-slate-700">
        <div className="p-10">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-(--primary) dark:text-[#60A5FA]">Eldent</h1>
          <div className="w-10 h-1 bg-(--primary) dark:bg-[#60A5FA] mt-2" />
        </div>
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:translate-x-2 active:scale-95 ${
                    pathname === item.href
                      ? 'bg-(--primary) dark:bg-[#60A5FA] text-white shadow-lg shadow-[rgba(59,130,246,0.18)] scale-[1.02]'
                      : 'text-(--primary) dark:text-[#60A5FA] hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="scale-110">{item.icon}</span>
                  <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-(--primary) dark:text-[#60A5FA] hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 active:scale-95"
          >
            <LogoutIcon />
            <span className="text-sm font-bold uppercase tracking-widest">Salir</span>
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
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 rounded-[50px] hover:bg-red-500/20 text-red-200 dark:text-red-300 transition-all w-full"
                >
                  <LogoutIcon />
                  <span className="text-sm font-bold uppercase tracking-wider">Salir</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-32 md:pb-0 min-h-screen">
        <header className="px-6 md:px-10 py-10 flex items-center justify-between sticky top-0 z-40 bg-(--background)/80 dark:bg-slate-950/80 backdrop-blur-md transition-all duration-500">
          <div className="flex flex-col">
            <h1 className="text-xs font-black uppercase tracking-[0.4em] text-(--primary) dark:text-[#60A5FA]">Dashboard</h1>
            {user && <span className="text-xl font-bold tracking-tight text-(--foreground) dark:text-slate-100">{user.name}</span>}
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
