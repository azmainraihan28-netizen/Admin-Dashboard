import React, { useEffect, useState } from 'react';
import { Search, Shield, User as UserIcon, Mail, Edit, Eye, Trash2, UserPlus, X } from 'lucide-react';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';

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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Employee Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    designation: '',
    staffId: '',
    department: '',
    password: '',
    role: 'employee' as UserRole
  });

  // Mock data
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
      avatar_url: 'https://ui-avatars.com/api/?name=System+Admin&background=00A55D&color=fff'
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
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      setEmployees(MOCK_EMPLOYEES);
      setLoading(false);
    }, 500);
  }, []);

  const updateRole = (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    // Simulate API delay
    setTimeout(() => {
      setEmployees(prev => prev.map(emp => emp.id === userId ? { ...emp, role: newRole } : emp));
      setUpdatingId(null);
    }, 500);
  };

  const deleteEmployee = (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${userName}? This will remove their profile from the directory.`)) {
      return;
    }
    setUpdatingId(userId);
    // Simulate API delay
    setTimeout(() => {
      setEmployees(prev => prev.filter(emp => emp.id !== userId));
      setUpdatingId(null);
    }, 500);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    // Simulate creation
    setTimeout(() => {
      const newProfile: Profile = {
        id: `EMP-${Date.now()}`,
        staff_id: newEmployee.staffId,
        full_name: newEmployee.name,
        email: `${newEmployee.staffId}@nexus.portal`,
        department: newEmployee.department,
        designation: newEmployee.designation,
        role: newEmployee.role,
        avatar_url: `https://ui-avatars.com/api/?background=00A55D&color=fff&name=${newEmployee.name}`
      };

      setEmployees(prev => [...prev, newProfile]);
      alert(`Employee ${newEmployee.name} added successfully! (Local Mock)`);
      setIsAddModalOpen(false);
      setNewEmployee({
        name: '',
        designation: '',
        staffId: '',
        department: '',
        password: '',
        role: 'employee'
      });
      setIsAdding(false);
    }, 800);
  };

  const filteredEmployees = employees.filter(emp => 
    (emp.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.staff_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (emp.department?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
      case 'editor': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'viewer': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
      default: return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Shield size={14} />;
      case 'editor': return <Edit size={14} />;
      case 'viewer': return <Eye size={14} />;
      default: return <UserIcon size={14} />;
    }
  };

  return (
    <div className="space-y-8 relative">
       {/* Add Employee Modal */}
       {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-950/70" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg relative z-10 p-6 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Employee</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddEmployee} className="space-y-5">
              <Input 
                label="Full Name" 
                placeholder="e.g. John Doe"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Designation" 
                  placeholder="e.g. Manager"
                  value={newEmployee.designation}
                  onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                  required
                />
                 <Input 
                  label="Department" 
                  placeholder="e.g. Sales"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Staff ID (Username)" 
                  placeholder="e.g. 31304"
                  value={newEmployee.staffId}
                  onChange={(e) => setNewEmployee({...newEmployee, staffId: e.target.value})}
                  required
                />
                 <Input 
                  label="Password" 
                  type="text"
                  placeholder="min 6 chars"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                  required
                />
              </div>
              <Select 
                label="Initial Role"
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value as UserRole})}
                options={[
                  { value: 'employee', label: 'Employee' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'editor', label: 'Editor' },
                  { value: 'viewer', label: 'Viewer' }
                ]}
              />

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? 'Creating...' : 'Create Employee'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage system access, roles, and view employee details.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus size={18} />
          Add Employee
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, ID, or department..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredEmployees.length}</span> employees
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No employees found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {emp.avatar_url ? (
                          <img src={emp.avatar_url} alt={emp.full_name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                            <UserIcon size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{emp.full_name}</p>
                          <p className="text-xs text-slate-400 font-mono">{emp.staff_id || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Mail size={14} className="text-slate-400" />
                        <span>{emp.email || 'No email'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col">
                         <span>{emp.designation}</span>
                         <span className="text-xs text-slate-400">{emp.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative inline-flex items-center">
                          <select 
                            value={emp.role}
                            onChange={(e) => updateRole(emp.id, e.target.value as UserRole)}
                            disabled={updatingId === emp.id}
                            className={`
                              appearance-none pl-9 pr-8 py-1.5 rounded-full text-xs font-medium border shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 dark:focus:ring-offset-slate-800
                              ${getRoleColor(emp.role)}
                              ${updatingId === emp.id ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <div className={`absolute left-3 pointer-events-none ${emp.role === 'admin' ? 'text-purple-700 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400'}`}>
                            {updatingId === emp.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              getRoleIcon(emp.role)
                            )}
                          </div>
                          {/* Custom dropdown arrow */}
                          <div className="absolute right-3 pointer-events-none text-current opacity-70">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>

                        <button 
                          onClick={() => deleteEmployee(emp.id, emp.full_name)}
                          disabled={updatingId === emp.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-md transition-colors"
                          title="Remove Employee"
                        >
                          <Trash2 size={16} />
                        </button>
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