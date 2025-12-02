import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, FileText, Filter, Search, ChevronDown, Eye, MessageSquare, Paperclip } from 'lucide-react';
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
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'In Review': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      default: return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
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

  const selectedReq = requisitions.find(r => r.id === selectedReqId);

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const StatCard = ({ title, count, color, icon: Icon }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{count}</p>
      </div>
      <div className={`p-3 rounded-lg ${color} dark:bg-opacity-20`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      {/* Review Modal */}
      {isReviewModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-950/70" onClick={() => setIsReviewModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl relative z-10 p-6 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review Requisition</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedReq.id} • {SERVICES.find(s => s.id === selectedReq.serviceId)?.title}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedReq.status)}`}>
                {selectedReq.status}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-6">
              {/* Request Details Block */}
              <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-lg border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-indigo-600 dark:text-indigo-400"/>
                  Requisition Details
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Requester</span>
                    <span className="font-medium text-slate-900 dark:text-white">{selectedReq.requesterName}</span>
                    <span className="block text-xs text-slate-500">{selectedReq.department}</span>
                    {selectedReq.requesterStaffId && (
                      <span className="block text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">{selectedReq.requesterStaffId}</span>
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Date Submitted</span>
                    <span className="font-medium text-slate-900 dark:text-white">{selectedReq.date}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Summary</span>
                    <span className="font-medium text-slate-900 dark:text-white">{selectedReq.summary}</span>
                  </div>
                </div>

                {/* Dynamic Form Data */}
                {selectedReq.formData && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    {Object.entries(selectedReq.formData).map(([key, value]) => {
                      if (key === 'attachments') return null;
                      if (value === null || value === undefined || value === '') return null;
                      return (
                        <div key={key} className={Array.isArray(value) || String(value).length > 50 ? "sm:col-span-2" : ""}>
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                            {formatKey(key)}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white break-words">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Attachments */}
                {selectedReq.attachments && selectedReq.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Attachments</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedReq.attachments.map((file: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                          <Paperclip size={14} className="text-indigo-500" />
                          <span className="max-w-[200px] truncate">{file.name || `Attachment ${idx + 1}`}</span>
                          <span className="text-slate-400 border-l border-slate-200 dark:border-slate-500 pl-2 ml-1">
                             {file.size ? (file.size / 1024).toFixed(1) + ' KB' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Review Input */}
              <div>
                <TextArea 
                  label="Reviewer Comments" 
                  placeholder="Add a comment, question, or approval note..." 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
              <Button onClick={submitReview}>Submit Review</Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Console</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage employee requisitions and review system performance.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard 
          title="Pending Review" 
          count={requisitions.filter(r => r.status === 'Pending').length} 
          color="bg-amber-50 text-amber-600 dark:text-amber-400" 
          icon={Clock} 
        />
        <StatCard 
          title="In Review" 
          count={requisitions.filter(r => r.status === 'In Review').length} 
          color="bg-blue-50 text-blue-600 dark:text-blue-400" 
          icon={Eye} 
        />
        <StatCard 
          title="Approved Today" 
          count={requisitions.filter(r => r.status === 'Approved').length} 
          color="bg-green-50 text-green-600 dark:text-green-400" 
          icon={CheckCircle2} 
        />
        <StatCard 
          title="Rejected Today" 
          count={requisitions.filter(r => r.status === 'Rejected').length} 
          color="bg-red-50 text-red-600 dark:text-red-400" 
          icon={XCircle} 
        />
      </div>

      {/* Requisitions Management Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px]">
        <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Requisition Management</h2>
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by ID, Name or Dept..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as RequisitionStatus | 'All')}
                  className="appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 py-2 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" size={14} />
              </div>

              <div className="relative">
                <select 
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value as ServiceType | 'All')}
                  className="appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 py-2 cursor-pointer max-w-[160px] truncate"
                >
                  <option value="All">All Services</option>
                  {SERVICES.map(service => (
                    <option key={service.id} value={service.id}>{service.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">ID</th>
                <th className="px-6 py-3">Requester</th>
                <th className="px-6 py-3">Service Type</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredRequisitions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Filter className="text-slate-300 dark:text-slate-600 mb-2" size={32} />
                      <p>No requisitions match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequisitions.map((req) => (
                  <tr key={req.id} onClick={() => handleReviewClick(req.id)} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300 font-medium">{req.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-white">{req.requesterName}</span>
                        <span className="text-xs text-slate-400">{req.department}</span>
                      </div>
                      {req.comments && (
                        <div className="mt-1 flex items-start gap-1 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-1.5 rounded">
                          <MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1 italic">{req.comments}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <span className="text-slate-400 dark:text-slate-500">{getServiceIcon(req.serviceId)}</span>
                        <span className="capitalize">{SERVICES.find(s => s.id === req.serviceId)?.title || req.serviceId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {req.status === 'Pending' || req.status === 'In Review' ? (
                        <div className="flex items-center justify-end gap-2">
                           <button 
                            onClick={(e) => { e.stopPropagation(); handleReviewClick(req.id); }}
                            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors border border-blue-200 dark:border-blue-800" 
                            title="Review Request"
                          >
                            <Eye size={14} className="group-hover:scale-110 transition-transform" />
                            Review
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onAction(req.id, 'Approved'); }}
                            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors border border-green-200 dark:border-green-800" 
                            title="Approve Request"
                          >
                            <CheckCircle2 size={14} className="group-hover:scale-110 transition-transform" />
                            Approve
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onAction(req.id, 'Rejected'); }}
                            className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors border border-red-200 dark:border-red-800" 
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