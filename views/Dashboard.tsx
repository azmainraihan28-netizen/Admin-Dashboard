import React from 'react';
import { SERVICES } from '../constants';
import { ServiceType } from '../types';

interface DashboardProps {
  onSelectService: (id: ServiceType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectService }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Service Overview</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Select a category to submit a new requisition.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SERVICES.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className="group flex flex-col items-start p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all duration-200 text-left w-full"
          >
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <service.icon size={24} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {service.title}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {service.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};