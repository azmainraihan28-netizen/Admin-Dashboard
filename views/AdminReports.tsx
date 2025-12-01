import React from 'react';
import { SERVICES, MOCK_YEARLY_STATS } from '../constants';
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

export const AdminReports: React.FC = () => {
  // Aggregate Totals
  const totalRequests = MOCK_YEARLY_STATS.reduce((acc, stat) => acc + stat.totalRequests, 0);
  const totalApproved = MOCK_YEARLY_STATS.reduce((acc, stat) => acc + stat.approved, 0);
  const avgCompletionRate = Math.round((totalApproved / totalRequests) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Annual Service Report</h1>
          <p className="text-slate-500 mt-1">Performance analysis and portfolio breakdown for Fiscal Year 2023.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
            <option>FY 2023</option>
            <option>FY 2022</option>
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
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12% YoY</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Requests</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalRequests.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+4% YoY</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Completion Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{avgCompletionRate}%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Employees Served</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,248</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <PieChart size={20} />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">Target 80%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Avg Budget Utilization</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">68%</p>
        </div>
      </div>

      {/* Portfolio Breakdown Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-600" />
          Portfolio Performance
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_YEARLY_STATS.map((stat) => {
            const service = SERVICES.find(s => s.id === stat.serviceId);
            if (!service) return null;

            const approvalRate = Math.round((stat.approved / stat.totalRequests) * 100);

            return (
              <div key={stat.serviceId} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                      <service.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{service.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{stat.totalRequests} total requests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-slate-900">{approvalRate}%</span>
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
                        style={{ width: `${(stat.approved / stat.totalRequests) * 100}%` }}
                        title="Approved"
                      />
                      <div 
                        className="h-full bg-amber-400" 
                        style={{ width: `${(stat.pending / stat.totalRequests) * 100}%` }}
                        title="Pending"
                      />
                      <div 
                        className="h-full bg-red-400" 
                        style={{ width: `${(stat.rejected / stat.totalRequests) * 100}%` }}
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
                        {stat.avgProcessingTime}
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
      </div>
    </div>
  );
};