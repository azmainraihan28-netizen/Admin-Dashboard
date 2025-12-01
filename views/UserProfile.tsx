import React from 'react';
import { CURRENT_USER, MOCK_REQUISITIONS, SERVICES } from '../constants';
import { Mail, Building, FileText, CheckCircle2, Clock, XCircle, User } from 'lucide-react';
import { RequisitionStatus } from '../types';

export const UserProfile: React.FC = () => {
  // Filter requisitions for the current user
  const myRequisitions = MOCK_REQUISITIONS.filter(req => req.requesterId === CURRENT_USER.id);

  const getStatusColor = (status: RequisitionStatus) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status: RequisitionStatus) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getServiceDetails = (serviceId: string) => {
    return SERVICES.find(s => s.id === serviceId);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-6 pb-6">
          <div className="relative flex items-end -mt-12 mb-6">
            <img 
              src={CURRENT_USER.avatarUrl} 
              alt={CURRENT_USER.name} 
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover"
            />
            <div className="ml-6 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{CURRENT_USER.name}</h1>
              <p className="text-slate-500 font-medium">{CURRENT_USER.department}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Employee ID</p>
                <p className="text-sm font-semibold">{CURRENT_USER.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Email</p>
                <p className="text-sm font-semibold">alex.sterling@nexus.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Building size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Location</p>
                <p className="text-sm font-semibold">Building A, Floor 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requisition History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText size={20} className="text-indigo-600" />
          My Requisitions
        </h2>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {myRequisitions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p>You haven't submitted any requisitions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Request Details</th>
                    <th className="px-6 py-4">Service Category</th>
                    <th className="px-6 py-4">Date Submitted</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRequisitions.map((req) => {
                    const service = getServiceDetails(req.serviceId);
                    return (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-mono text-xs font-medium text-slate-400 mb-1 block group-hover:text-indigo-500 transition-colors">{req.id}</span>
                            <p className="font-medium text-slate-900 line-clamp-1">{req.summary}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            {service && <service.icon size={16} className="text-slate-400" />}
                            <span>{service?.title || req.serviceId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {req.date}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                            {getStatusIcon(req.status)}
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};