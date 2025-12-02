import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  UserCircle,
  X,
  FileText,
  Users,
  Activity,
  ShieldCheck,
  BarChart3,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Camera,
  Save,
  Moon,
  Sun
} from 'lucide-react';
import { User } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onUpdateUser: (user: Partial<User>) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateProfile?: () => void;
  onNavigateReports?: () => void;
  onNavigateActivityLog?: () => void;
  onNavigateEmployees?: () => void;
  isAdmin?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user,
  onUpdateUser,
  onLogout, 
  onNavigateHome, 
  onNavigateProfile,
  onNavigateReports,
  onNavigateActivityLog,
  onNavigateEmployees,
  isAdmin = false 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    department: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (isEditProfileOpen) {
      setEditForm({
        name: user.name,
        department: user.department,
        avatarUrl: user.avatarUrl
      });
    }
  }, [isEditProfileOpen, user]);

  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(editForm);
    setIsEditProfileOpen(false);
  };

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/70 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-950/70" onClick={() => setIsEditProfileOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer">
                  <img 
                    src={editForm.avatarUrl || user.avatarUrl} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 dark:border-slate-700 shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={20} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Click to change avatar</p>
              </div>

              <Input 
                label="Full Name" 
                value={editForm.name} 
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
              <Input 
                label="Designation / Department" 
                value={editForm.department} 
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                required
              />
              <Input 
                label="Avatar Image URL" 
                value={editForm.avatarUrl} 
                onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                placeholder="https://..."
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsEditProfileOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2">
                  <Save size={16} />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out lg:static 
          flex flex-col h-full
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        <div className={`h-16 flex-shrink-0 flex items-center ${isCollapsed ? 'justify-center lg:px-0' : 'justify-between px-6'} border-b border-slate-100 dark:border-slate-700 transition-all duration-300`}>
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 cursor-pointer overflow-hidden" onClick={onNavigateHome}>
            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white ${isAdmin ? 'bg-slate-800 dark:bg-slate-900' : 'bg-indigo-600'}`}>
              {isAdmin ? <ShieldCheck size={18} /> : 'N'}
            </div>
            <span className={`transition-opacity duration-300 ${isAdmin ? 'text-slate-900 dark:text-white' : 'text-indigo-600 dark:text-indigo-400'} ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
              {isAdmin ? 'Nexus Admin' : 'Nexus'}
            </span>
          </div>
          <button className="lg:hidden text-slate-500 dark:text-slate-400" onClick={toggleSidebar}>
            <X size={20} />
          </button>
          {/* Desktop Collapse Button */}
          <button 
            className={`hidden lg:flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 ${isCollapsed ? 'absolute -right-3 top-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm z-50' : ''}`}
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav Items - Scrollable */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {isAdmin ? (
            <>
               <button 
                onClick={onNavigateHome}
                title={isCollapsed ? "Dashboard" : ""}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700/50`}
              >
                <Activity size={20} className="text-slate-600 dark:text-slate-300 flex-shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Dashboard</span>
              </button>
               <button 
                onClick={onNavigateReports}
                title={isCollapsed ? "Reports" : ""}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white`}
              >
                <BarChart3 size={20} className="flex-shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Reports</span>
              </button>
              
              <div className={`pt-4 pb-2 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Management
                </p>
              </div>
              {isCollapsed && <div className="h-px bg-slate-100 dark:bg-slate-700 my-4 mx-2 lg:block hidden"></div>}

              <button 
                onClick={onNavigateActivityLog}
                title={isCollapsed ? "Activity Logs" : ""}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white`}
              >
                <ScrollText size={20} className="flex-shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Activity Logs</span>
              </button>
              <button 
                onClick={onNavigateEmployees}
                title={isCollapsed ? "Employees" : ""}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white`}
              >
                <Users size={20} className="flex-shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Employees</span>
              </button>
              <button 
                title={isCollapsed ? "System Config" : ""}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white`}
              >
                <Settings size={20} className="flex-shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>System Config</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onNavigateHome}
                title={isCollapsed ? "Overview" : ""}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700/50`}
              >
                <LayoutDashboard size={20} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Overview</span>
              </button>
              
              <div className={`pt-4 pb-2 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  My Account
                </p>
              </div>
              {isCollapsed && <div className="h-px bg-slate-100 dark:bg-slate-700 my-4 mx-2 lg:block hidden"></div>}

              <button 
                onClick={onNavigateProfile}
                title={isCollapsed ? "Profile" : ""}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white`}
              >
                <UserCircle size={20} className="flex-shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Profile</span>
              </button>
              <button 
                title={isCollapsed ? "Settings" : ""}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white`}
              >
                <Settings size={20} className="flex-shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Settings</span>
              </button>
            </>
          )}
        </nav>

        {/* User Footer - Fixed at bottom of sidebar */}
        <div className="flex-shrink-0 p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div 
            onClick={() => setIsEditProfileOpen(true)}
            className={`flex items-center gap-3 mb-4 p-2 -mx-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group ${isCollapsed ? 'justify-center' : ''}`}
            title="Edit Profile"
          >
            <div className="relative">
              <img 
                src={user.avatarUrl} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600 flex-shrink-0"
              />
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-700 rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                 <Settings size={10} className="text-slate-500 dark:text-slate-300" />
              </div>
            </div>
            
            <div className={`flex-1 min-w-0 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.department}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            title={isCollapsed ? "Sign Out" : ""}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : 'justify-center'}`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Flex column, scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 transition-colors duration-300">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 px-4 lg:px-8">
            <div className="max-w-lg w-full relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 dark:text-slate-500" />
              </div>
              <input 
                type="text" 
                placeholder={isAdmin ? "Search employees, logs, or requests..." : "Search for services..."}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg leading-5 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-400 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="relative p-2 text-slate-400 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-800 bg-red-500"></span>
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Page Content - Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};