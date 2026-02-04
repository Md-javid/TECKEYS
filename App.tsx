import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileUp,
  History,
  BarChart3,
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { Page, Bill } from './types';
import Dashboard from './components/Dashboard';
import BillUpload from './components/BillUpload';
import BillHistory from './components/BillHistory';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import Settings from './components/Settings';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { LandingPage } from './components/LandingPage';
import { authAPI } from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [bills, setBills] = useState<Bill[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    checkAuth();
    const savedTheme = (localStorage.getItem('billagent_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'dark' | 'light') => {
    document.documentElement.className = newTheme;
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        setCurrentUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setAuthView('landing');
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('billagent_theme', newTheme);
    applyTheme(newTheme);
  };

  const handleLoginSuccess = async () => {
    await checkAuth();
    setIsAuthenticated(true);
    setCurrentPage(Page.Dashboard);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage(Page.Dashboard);
    setAuthView('landing');
    setShowProfileMenu(false);
  };

  const saveBills = (newBills: Bill[]) => {
    setBills(newBills);
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New bill processed successfully', time: '2 min ago', unread: true },
    { id: 2, text: 'Weekly report is ready', time: '1 hour ago', unread: true },
    { id: 3, text: 'Profile updated', time: '2 hours ago', unread: false },
  ];

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setAuthView('register')}
          onLogin={() => setAuthView('login')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <Register
          onRegisterSuccess={handleLoginSuccess}
          onSwitchToLogin={() => setAuthView('login')}
          onBack={() => setAuthView('landing')}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setAuthView('register')}
        onBack={() => setAuthView('landing')}
      />
    );
  }

  const NavItem = ({ page, icon: Icon, label }: { page: Page, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false);
      }}
      className={`tap-effect flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 ${currentPage === page
        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
        : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
        }`}
    >
      <Icon size={18} />
      <span className="font-semibold text-sm whitespace-nowrap tracking-tight">{label}</span>
    </button>
  );

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard bills={bills} onNavigate={setCurrentPage} />;
      case Page.Process:
        return <BillUpload onComplete={(newBill) => saveBills([newBill, ...bills])} />;
      case Page.History:
        return <BillHistory bills={bills} />;
      case Page.Analytics:
        return <AnalyticsDashboard />;
      case Page.Settings:
        return <Settings />;
      default:
        return <Dashboard bills={bills} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-500 pb-20 bg-slate-50 dark:bg-[#020617]">
      {/* Floating Glassy Top Navigation */}
      <nav className="nav-glass px-6 py-4 flex items-center justify-between lg:grid lg:grid-cols-3 gap-4">
        {/* Left: Empty or minimal branding */}
        <div className="flex items-center gap-3">
          {/* Removed logo and text as requested */}
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="flex items-center bg-white/50 dark:bg-white/5 p-1 rounded-[1.8rem] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
            <NavItem page={Page.Dashboard} icon={LayoutDashboard} label="Dashboard" />
            <NavItem page={Page.Process} icon={FileUp} label="Process" />
            <NavItem page={Page.History} icon={History} label="History" />
            <NavItem page={Page.Analytics} icon={BarChart3} label="Analytics" />
            <NavItem page={Page.Settings} icon={SettingsIcon} label="Settings" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="tap-effect p-2 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="tap-effect relative p-2 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#030712]" />
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-xl z-500 animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {notifications.filter(n => n.unread).length} new
                    </span>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl transition-all ${notif.unread
                          ? 'bg-blue-500 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-8000'
                          : 'bg-slate-500 dark:bg-white/5'
                          }`}
                      >
                        <p className="text-sm text-slate-900 dark:text-white">{notif.text}</p>
                        <p className="text-xs text-slate-500 dark:text-white/40 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="tap-effect p-2 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1 bg-white/50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none hover:bg-white/70 dark:hover:bg-white/10 transition-all"
            >
              <div className="text-right hidden md:block pl-3">
                <p className="text-xs font-bold text-slate-900 dark:text-white/90 leading-tight">
                  {currentUser?.first_name} {currentUser?.last_name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-white/40 font-medium">{currentUser?.store_type || 'User'}</p>
              </div>
              <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/20 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {currentUser?.first_name?.[0]}{currentUser?.last_name?.[0]}
              </div>
              <ChevronDown size={16} className="text-slate-600 dark:text-white/60 mr-2" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl p-3 shadow-xl z-50 animate-fade-in">
                <div className="p-3 border-b border-slate-200 dark:border-white/10">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {currentUser?.first_name} {currentUser?.last_name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-white/60">{currentUser?.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setCurrentPage(Page.Settings);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                  >
                    <User size={18} />
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage(Page.Settings);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                  >
                    <SettingsIcon size={18} />
                    <span>Settings</span>
                  </button>
                  <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="tap-effect lg:hidden p-2.5 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white bg-white/50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-6 top-28 z-50 lg:hidden glass-card p-6 flex flex-col gap-3 animate-fade-in">
          <NavItem page={Page.Dashboard} icon={LayoutDashboard} label="Dashboard" />
          <NavItem page={Page.Process} icon={FileUp} label="Process Bill" />
          <NavItem page={Page.History} icon={History} label="History" />
          <NavItem page={Page.Analytics} icon={BarChart3} label="Analytics" />
          <NavItem page={Page.Settings} icon={SettingsIcon} label="Settings" />
          <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="font-semibold text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 mt-8">
        {renderPage()}
      </main>

      {/* Floating Bottom Nav for Mobile */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:hidden z-50">
        <button
          onClick={() => setCurrentPage(Page.Process)}
          className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl shadow-blue-500/50 text-white hover:scale-105 transition-transform"
        >
          <FileUp size={28} />
        </button>
      </div>
    </div>
  );
};

export default App;
