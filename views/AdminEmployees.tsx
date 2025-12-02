import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, Shield, User as UserIcon, Mail } from 'lucide-react';
import { UserRole } from '../types';

interface Profile {
  id: string;
  staff_id: string;
  full_name: string;
  email: string;
  department: string;
  designation: string;
  role: UserRole;
  avatar_url: string;
}

export const AdminEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for fallback
  const MOCK_EMPLOYEES: Profile[] = [
    {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      staff_id: 'EMP-0042',
      full_name: 'Alex Sterling',
      email: 'alex.sterling@nexus.com',
      department: 'Product Engineering',
      designation: 'Senior Developer',
      role: 'employee',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
      staff_id: 'ADM-31303',
      full_name: 'System Administrator',
      email: 'admin@nexus.com',
      department: 'IT Operations',
      designation: 'System Admin',
      role: 'admin',
      avatar_url: 'https://ui-avatars.com/api/?name=System+Admin&background=6366f1&color=fff'
    },
    {
      id: 'uuid-sarah',
      staff_id: 'EMP-0043',
      full_name: 'Sarah Chen',
      email: 'sarah.chen@nexus.com',
      department: 'Marketing',
      designation: 'Marketing Lead',
      role: 'employee',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 'uuid-jessica',
      staff_id: 'EMP-0045',
      full_name: 'Jessica Pearson',
      email: 'jessica.pearson@nexus.com',
      department: 'Legal',
      designation: 'Managing Partner',
      role: 'employee',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    
    if (data && data.length > 0) {
      setEmployees(data);
    } else {
      // Fallback to mock data
      setEmployees(MOCK_EMPLOYEES);
      if (error) console.log('Using mock employees due to error or empty DB:', error.message);
    }
    setLoading(false);
  };

  const filteredEmployees = employees.filter(emp => 
    (emp.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.staff_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.department?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Employee Directory</h1>
        <p className="text-slate-500 mt-1">Manage system access and view employee details.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, ID, or department..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredEmployees.length}</span> employees
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Designation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No employees found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {emp.avatar_url ? (
                          <img src={emp.avatar_url} alt={emp.full_name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <UserIcon size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{emp.full_name}</p>
                          <p className="text-xs text-slate-400 font-mono">{emp.staff_id || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        <span>{emp.email || 'No email'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${emp.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {emp.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                        <span className="capitalize">{emp.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex flex-col">
                         <span>{emp.designation}</span>
                         <span className="text-xs text-slate-400">{emp.department}</span>
                      </div>
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