import React, { useState } from 'react';
import { ActivityLog } from '../types';
import { Search, ScrollText, Filter } from 'lucide-react';

interface AdminActivityLogProps {
  logs: ActivityLog[];
}

export const AdminActivityLog: React.FC<AdminActivityLogProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'success' | 'error' | 'info' | 'warning'>('All');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-700 ring-green-500/20';
      case 'error': return 'bg-red-100 text-red-700 ring-red-500/20';
      case 'warning': return 'bg-amber-100 text-amber-700 ring-amber-500/20';
      default: return 'bg-blue-100 text-blue-700 ring-blue-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Activity Logs</h1>
        <p className="text-slate-500 mt-1">Audit trail of all administrative actions and system events.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {['All', 'success', 'error', 'info'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors
                  ${filterType === type 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Filter className="mx-auto text-slate-300 mb-3" size={32} />
              <p>No activity logs found matching your criteria.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-1 ring-inset ${getTypeStyles(log.type)}`}>
                      <ScrollText size={14} className="opacity-70" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {log.action}
                      </p>
                      <span className="text-xs text-slate-400 whitespace-nowrap font-mono">{log.timestamp}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{log.user}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">ID: {log.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};