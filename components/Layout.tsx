import React, { useState } from 'react';
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
  ScrollText
} from 'lucide-react';
import { CURRENT_USER, ADMIN_USER } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateProfile?: () => void;
  onNavigateReports?: () => void;
  onNavigateActivityLog?: () => void;
  isAdmin?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onLogout, 
  onNavigateHome, 
  onNavigateProfile,
  onNavigateReports,
  onNavigateActivityLog,
  isAdmin = false 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = isAdmin ? ADMIN_USER : CURRENT_USER;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed height, scrollable internally */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col h-full
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex-shrink-0 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 cursor-pointer" onClick={onNavigateHome}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${isAdmin ? 'bg-slate-800' : 'bg-indigo-600'}`}>
              {isAdmin ? <ShieldCheck size={18} /> : 'N'}
            </div>
            <span className={isAdmin ? 'text-slate-900' : 'text-indigo-600'}>
              {isAdmin ? 'Nexus Admin' : 'Nexus'}
            </span>
          </div>
          <button className="ml-auto lg:hidden text-slate-500" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        {/* Nav Items - Scrollable */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {isAdmin ? (
            <>
               <button 
                onClick={onNavigateHome}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg"
              >
                <Activity size={20} className="text-slate-600" />
                Dashboard
              </button>
               <button 
                onClick={onNavigateReports}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
              >
                <BarChart3 size={20} />
                Reports
              </button>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Management
                </p>
              </div>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
                <FileText size={20} />
                Requisitions
                <span className="ml-auto bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs font-medium">12</span>
              </button>
              <button 
                onClick={onNavigateActivityLog}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
              >
                <ScrollText size={20} />
                Activity Logs
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
                <Users size={20} />
                Employees
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
                <Settings size={20} />
                System Config
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onNavigateHome}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg"
              >
                <LayoutDashboard size={20} className="text-indigo-600" />
                Overview
              </button>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  My Account
                </p>
              </div>
              <button 
                onClick={onNavigateProfile}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
              >
                <UserCircle size={20} />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg">
                <Settings size={20} />
                Settings
              </button>
            </>
          )}
        </nav>

        {/* User Footer - Fixed at bottom of sidebar */}
        <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={user.avatarUrl} 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.department}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content - Flex column, scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 px-4 lg:px-8">
            <div className="max-w-lg w-full relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder={isAdmin ? "Search employees, logs, or requests..." : "Search for services..."}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Page Content - Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};