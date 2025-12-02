import React, { useState, useEffect } from 'react';
import { ViewState, ServiceType, UserRole, Requisition, ActivityLog, RequisitionStatus, User } from './types';
import { CURRENT_USER, ADMIN_USER, MOCK_REQUISITIONS, MOCK_ACTIVITY_LOGS } from './constants';
import { Layout } from './components/Layout';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { ServiceRequest } from './views/ServiceRequest';
import { AdminDashboard } from './views/AdminDashboard';
import { UserProfile } from './views/UserProfile';
import { AdminReports } from './views/AdminReports';
import { AdminActivityLog } from './views/AdminActivityLog';
import { AdminEmployees } from './views/AdminEmployees';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Shared State
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Fetch initial data from Supabase
  useEffect(() => {
    fetchData();

    // Set up Realtime Subscription
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requisitions' }, () => {
        fetchRequisitions();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequisitions = async () => {
    const { data, error } = await supabase
      .from('requisitions')
      .select('*')
      .order('date', { ascending: false });
    
    if (data && data.length > 0) {
      // Map snake_case DB columns to camelCase TS types
      const mapped: Requisition[] = data.map((item: any) => ({
        id: item.id,
        serviceId: item.service_id,
        requesterName: item.requester_name,
        requesterId: item.requester_id,
        requesterStaffId: item.requester_staff_id, // Map staff ID from DB
        department: item.department,
        date: item.date,
        status: item.status,
        summary: item.summary,
        comments: item.comments,
        formData: item.form_data, // Map form_data from DB
        attachments: item.attachments // Map attachments from DB
      }));
      setRequisitions(mapped);
    } else {
      // Fallback to mock data if DB is empty
      setRequisitions(MOCK_REQUISITIONS);
      if (error) console.log('Using mock requisitions due to fetch error or empty DB:', error.message);
    }
  };

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (data && data.length > 0) {
      const mapped: ActivityLog[] = data.map((item: any) => ({
        id: item.id,
        action: item.action,
        user: item.user_name,
        timestamp: item.timestamp,
        type: item.type
      }));
      setActivityLogs(mapped);
    } else {
      // Fallback to mock logs
      setActivityLogs(MOCK_ACTIVITY_LOGS);
      if (error) console.log('Using mock logs due to fetch error or empty DB:', error.message);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    Promise.all([fetchRequisitions(), fetchLogs()]).finally(() => setIsLoading(false));
  };

  // Ensure the mock user exists in the real DB so FK constraints work
  const syncUserProfile = async (user: User) => {
    // Only attempt sync if we have a valid UUID structure (mock users have valid UUIDs)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      staff_id: user.staffId,
      full_name: user.name,
      email: `${user.name.toLowerCase().replace(/\s/g, '.')}@nexus.com`,
      department: user.department,
      designation: user.role === 'admin' ? 'System Admin' : 'Employee',
      role: user.role,
      avatar_url: user.avatarUrl
    });

    if (error) {
       // Log but don't block login, as it might be a permissions issue or table missing
       if (error.code === '23503') {
          console.error("FK Violation detected. The user ID from constants does not exist in Supabase auth.users. This is expected with mock UUIDs if standard Auth is not used.");
       } else {
          console.warn("Could not sync profile to Supabase:", error.message, error.code);
       }
    }
  };

  const handleLogin = async (role: UserRole) => {
    let userToLogin: User;
    if (role === 'admin') {
      userToLogin = { ...ADMIN_USER, role: 'admin' };
      setViewState('admin-dashboard');
    } else {
      userToLogin = { ...CURRENT_USER, role: 'employee' };
      setViewState('dashboard');
    }
    setCurrentUser(userToLogin);
    
    // Sync to DB
    await syncUserProfile(userToLogin);
  };

  const handleLogout = () => {
    setViewState('login');
    setCurrentUser(null);
  };

  const handleUpdateUser = async (updatedUser: Partial<User>) => {
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedUser };
      setCurrentUser(newUser);
      await syncUserProfile(newUser);
    }
  };

  const handleSelectService = (serviceId: ServiceType) => {
    setViewState({ type: 'service', serviceId });
  };

  const handleBackToDashboard = () => {
    if (currentUser?.role === 'admin') {
      setViewState('admin-dashboard');
    } else {
      setViewState('dashboard');
    }
  };

  const handleNavigateProfile = () => {
    setViewState('profile');
  };

  const handleNavigateReports = () => {
    setViewState('admin-reports');
  };

  const handleNavigateActivityLog = () => {
    setViewState('admin-activity-log');
  };

  const handleNavigateEmployees = () => {
    setViewState('admin-employees');
  };

  // --- Actions ---

  const handleCreateRequisition = async (newRequisition: Requisition) => {
    // 1. Insert into DB
    const { error } = await supabase.from('requisitions').insert([{
      id: newRequisition.id,
      service_id: newRequisition.serviceId,
      requester_name: newRequisition.requesterName,
      requester_id: newRequisition.requesterId, // Now a valid UUID
      requester_staff_id: newRequisition.requesterStaffId, // Store Staff ID
      department: newRequisition.department,
      date: newRequisition.date,
      status: newRequisition.status,
      summary: newRequisition.summary,
      comments: newRequisition.comments,
      form_data: newRequisition.formData,
      attachments: newRequisition.attachments
    }]);

    if (error) {
      console.error('Error creating requisition:', error.message);
      // Fallback: Add to local state if DB fails (for demo flow)
      setRequisitions(prev => [newRequisition, ...prev]);
      return;
    }
    
    // 2. Log creation
    const newLog = {
      action: `New requisition ${newRequisition.id} submitted by ${newRequisition.requesterName}`,
      user_id: newRequisition.requesterId, // Link log to user
      user_name: newRequisition.requesterName,
      timestamp: new Date().toISOString(),
      type: 'info'
    };

    await supabase.from('activity_logs').insert([newLog]);
    
    // Refresh local data immediately
    fetchRequisitions();
    fetchLogs();
  };

  const handleRequisitionAction = async (id: string, action: RequisitionStatus, comment?: string) => {
    // 1. Update Requisition Status and Comment in DB
    const updates: any = { status: action };
    if (comment) updates.comments = comment;

    const { error } = await supabase
      .from('requisitions')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating requisition:', error.message);
       // Fallback for demo: update local state
       setRequisitions(prev => prev.map(req => 
        req.id === id ? { ...req, status: action, comments: comment } : req
       ));
      return;
    }

    // 2. Add to Activity Log in DB
    let logType = 'info';
    if (action === 'Approved') logType = 'success';
    if (action === 'Rejected') logType = 'error';
    if (action === 'In Review') logType = 'warning';

    const newLog = {
      action: `${action} request ${id}${comment ? ` with comment: "${comment}"` : ''}`,
      user_id: currentUser?.id, // Link to admin
      user_name: currentUser?.role === 'admin' ? currentUser.name : 'System',
      timestamp: new Date().toISOString(),
      type: logType
    };

    await supabase.from('activity_logs').insert([newLog]);
    
    // Refresh local data
    fetchRequisitions();
    fetchLogs();
  };

  // Login View
  if (viewState === 'login' || !currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Authenticated Views
  return (
    <Layout 
      user={currentUser}
      onUpdateUser={handleUpdateUser}
      onLogout={handleLogout} 
      onNavigateHome={handleBackToDashboard}
      onNavigateProfile={handleNavigateProfile}
      onNavigateReports={handleNavigateReports}
      onNavigateActivityLog={handleNavigateActivityLog}
      onNavigateEmployees={handleNavigateEmployees}
      isAdmin={currentUser.role === 'admin'}
    >
      {viewState === 'admin-dashboard' && currentUser.role === 'admin' && (
        <AdminDashboard 
          requisitions={requisitions} 
          onAction={handleRequisitionAction}
        />
      )}
      {viewState === 'admin-reports' && currentUser.role === 'admin' && (
        <AdminReports requisitions={requisitions} />
      )}
      {viewState === 'admin-activity-log' && currentUser.role === 'admin' && (
        <AdminActivityLog logs={activityLogs} />
      )}
      {viewState === 'admin-employees' && currentUser.role === 'admin' && (
        <AdminEmployees />
      )}
      {viewState === 'dashboard' && currentUser.role === 'employee' && (
        <Dashboard onSelectService={handleSelectService} />
      )}
      {viewState === 'profile' && currentUser.role === 'employee' && (
        <UserProfile user={currentUser} requisitions={requisitions} />
      )}
      {typeof viewState === 'object' && viewState.type === 'service' && (
        <ServiceRequest 
          user={currentUser}
          serviceId={viewState.serviceId} 
          onBack={handleBackToDashboard} 
          onSubmit={handleCreateRequisition}
        />
      )}
    </Layout>
  );
};

export default App;