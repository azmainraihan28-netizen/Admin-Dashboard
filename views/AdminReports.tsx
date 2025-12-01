import React from 'react';
import { SERVICES } from '../constants';
import { Requisition } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Users,
  PieChart,
  Download
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface AdminReportsProps {
  requisitions: Requisition[];
}

export const AdminReports: React.FC<AdminReportsProps> = ({ requisitions }) => {
  // --- Dynamic Calculations ---
  
  const totalRequests = requisitions.length;
  const totalApproved = requisitions.filter(r => r.status === 'Approved').length;
  const avgCompletionRate = totalRequests > 0 ? Math.round((totalApproved / totalRequests) * 100) : 0;
  
  // Unique users served
  const uniqueUsers = new Set(requisitions.map(r => r.requesterId)).size;
  
  // Calculate per-service stats
  const serviceStats = SERVICES.map(service => {
    const serviceReqs = requisitions.filter(r => r.serviceId === service.id);
    const total = serviceReqs.length;
    const approved = serviceReqs.filter(r => r.status === 'Approved').length;
    const rejected = serviceReqs.filter(r => r.status === 'Rejected').length;
    const pending = serviceReqs.filter(r => r.status === 'Pending' || r.status === 'In Review').length;
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    
    // Mock random budget utilization for demo purposes since we don't have cost fields
    // Deterministic based on service ID length to be consistent across renders without real data
    const budgetUtilized = total > 0 ? Math.min(100, Math.round(total * 12.5)) : 0; 
    
    return {
      service,
      total,
      approved,
      rejected,
      pending,
      approvalRate,
      budgetUtilized,
      avgTime: '2h 30m' // Placeholder as we don't track resolution time yet
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Annual Service Report</h1>
          <p className="text-slate-500 mt-1">Real-time performance analysis based on submitted requisitions.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
            <option>Current Period</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BarChart3 size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Requests</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalRequests.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Completion Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{avgCompletionRate}%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Employees Served</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{uniqueUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <PieChart size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Avg Budget Utilization</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">--%</p>
        </div>
      </div>

      {/* Portfolio Breakdown Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-600" />
          Portfolio Performance
        </h3>
        
        {totalRequests === 0 ? (
           <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
             <p className="text-slate-500">No data available yet. Waiting for employee submissions.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {serviceStats.map((stat) => {
              // Only show services that have at least one request
              if (stat.total === 0) return null;

              return (
                <div key={stat.service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                        <stat.service.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{stat.service.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{stat.total} total requests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-slate-900">{stat.approvalRate}%</span>
                      <p className="text-xs text-slate-500">Approval Rate</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Status Breakdown Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-600 font-medium">Request Distribution</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${(stat.approved / stat.total) * 100}%` }}
                          title="Approved"
                        />
                        <div 
                          className="h-full bg-amber-400" 
                          style={{ width: `${(stat.pending / stat.total) * 100}%` }}
                          title="Pending"
                        />
                        <div 
                          className="h-full bg-red-400" 
                          style={{ width: `${(stat.rejected / stat.total) * 100}%` }}
                          title="Rejected"
                        />
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div> Approved ({stat.approved})
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div> Pending ({stat.pending})
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div> Rejected ({stat.rejected})
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Avg Processing Time</p>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-semibold">
                          <Clock size={14} className="text-slate-400" />
                          {stat.avgTime}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Budget Utilization</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${stat.budgetUtilized > 90 ? 'bg-red-500' : 'bg-indigo-600'}`} 
                              style={{ width: `${stat.budgetUtilized}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{stat.budgetUtilized}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
