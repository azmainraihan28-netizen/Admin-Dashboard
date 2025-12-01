import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, FileText, Filter, Search, ChevronDown, Eye, MessageSquare } from 'lucide-react';
import { SERVICES } from '../constants';
import { Requisition, RequisitionStatus, ServiceType } from '../types';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/Input';

interface AdminDashboardProps {
  requisitions: Requisition[];
  onAction: (id: string, action: RequisitionStatus, comment?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ requisitions, onAction }) => {
  // Filter States
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | 'All'>('All');
  const [serviceFilter, setServiceFilter] = useState<ServiceType | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const getServiceIcon = (serviceId: string) => {
    const service = SERVICES.find(s => s.id === serviceId);
    return service ? <service.icon size={18} /> : <FileText size={18} />;
  };

  const getStatusColor = (status: RequisitionStatus) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'In Review': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const handleReviewClick = (id: string) => {
    setSelectedReqId(id);
    setReviewComment('');
    setIsReviewModalOpen(true);
  };

  const submitReview = () => {
    if (selectedReqId) {
      onAction(selectedReqId, 'In Review', reviewComment);
      setIsReviewModalOpen(false);
      setSelectedReqId(null);
    }
  };

  // Filter Logic
  const filteredRequisitions = requisitions.filter(req => {
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesService = serviceFilter === 'All' || req.serviceId === serviceFilter;
    const matchesSearch = 
      req.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesService && matchesSearch;
  });

  const StatCard = ({ title, count, color, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{count}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)}></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10 p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Review Requisition</h3>
            <p className="text-sm text-slate-500 mb-4">
              Add a comment or note for this requisition. This will mark the status as "In Review".
            </p>
            <TextArea 
              label="Reviewer Comments" 
              placeholder="e.g. Please clarify the budget code..." 
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="mb-6"
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
              <Button onClick={submitReview}>Submit Review</Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
        <p className="text-slate-500 mt-1">Manage employee requisitions and review system performance.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard 
          title="Pending Review" 
          count={requisitions.filter(r => r.status === 'Pending').length} 
          color="bg-amber-50 text-amber-600" 
          icon={Clock} 
        />
        <StatCard 
          title="In Review" 
          count={requisitions.filter(r => r.status === 'In Review').length} 
          color="bg-blue-50 text-blue-600" 
          icon={Eye} 
        />
        <StatCard 
          title="Approved Today" 
          count={requisitions.filter(r => r.status === 'Approved').length} 
          color="bg-green-50 text-green-600" 
          icon={CheckCircle2} 
        />
        <StatCard 
          title="Rejected Today" 
          count={requisitions.filter(r => r.status === 'Rejected').length} 
          color="bg-red-50 text-red-600" 
          icon={XCircle} 
        />
      </div>

      {/* Requisitions Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Requisition Management</h2>
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by ID, Name or Dept..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as RequisitionStatus | 'All')}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 py-2 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
              </div>

              <div className="relative">
                <select 
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value as ServiceType | 'All')}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 py-2 cursor-pointer max-w-[160px] truncate"
                >
                  <option value="All">All Services</option>
                  {SERVICES.map(service => (
                    <option key={service.id} value={service.id}>{service.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">ID</th>
                <th className="px-6 py-3">Requester</th>
                <th className="px-6 py-3">Service Type</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequisitions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Filter className="text-slate-300 mb-2" size={32} />
                      <p>No requisitions match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequisitions.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600 font-medium">{req.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{req.requesterName}</span>
                        <span className="text-xs text-slate-400">{req.department}</span>
                      </div>
                      {req.comments && (
                        <div className="mt-1 flex items-start gap-1 text-xs text-indigo-600 bg-indigo-50 p-1.5 rounded">
                          <MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1 italic">{req.comments}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="text-slate-400">{getServiceIcon(req.serviceId)}</span>
                        <span className="capitalize">{SERVICES.find(s => s.id === req.serviceId)?.title || req.serviceId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'Pending' || req.status === 'In Review' ? (
                        <div className="flex items-center justify-end gap-2">
                           <button 
                            onClick={() => handleReviewClick(req.id)}
                            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200" 
                            title="Review Request"
                          >
                            <Eye size={14} className="group-hover:scale-110 transition-transform" />
                            Review
                          </button>
                          <button 
                            onClick={() => onAction(req.id, 'Approved')}
                            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200" 
                            title="Approve Request"
                          >
                            <CheckCircle2 size={14} className="group-hover:scale-110 transition-transform" />
                            Approve
                          </button>
                          <button 
                            onClick={() => onAction(req.id, 'Rejected')}
                            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200" 
                            title="Reject Request"
                          >
                            <XCircle size={14} className="group-hover:scale-110 transition-transform" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic px-2">
                          {req.status === 'Approved' ? 'Processed' : 'Closed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};