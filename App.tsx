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

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Shared State (Local Memory)
  const [requisitions, setRequisitions] = useState<Requisition[]>(MOCK_REQUISITIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(MOCK_ACTIVITY_LOGS);

  const handleLogin = (role: UserRole) => {
    let userToLogin: User;
    if (role === 'admin') {
      userToLogin = { ...ADMIN_USER, role: 'admin' };
      setViewState('admin-dashboard');
    } else {
      userToLogin = { ...CURRENT_USER, role: 'employee' };
      setViewState('dashboard');
    }
    setCurrentUser(userToLogin);
  };

  const handleLogout = () => {
    setViewState('login');
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedUser };
      setCurrentUser(newUser);
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

  const handleCreateRequisition = (newRequisition: Requisition) => {
    // 1. Add to local state
    setRequisitions(prev => [newRequisition, ...prev]);
    
    // 2. Log creation
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      action: `New requisition ${newRequisition.id} submitted by ${newRequisition.requesterName}`,
      user: newRequisition.requesterName,
      timestamp: new Date().toISOString(),
      type: 'info'
    };

    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleRequisitionAction = (id: string, action: RequisitionStatus, comment?: string) => {
    // 1. Update Requisition Status and Comment in local state
    setRequisitions(prev => prev.map(req => 
      req.id === id ? { ...req, status: action, comments: comment } : req
    ));

    // 2. Add to Activity Log
    let logType: ActivityLog['type'] = 'info';
    if (action === 'Approved') logType = 'success';
    if (action === 'Rejected') logType = 'error';
    if (action === 'In Review') logType = 'warning';

    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      action: `${action} request ${id}${comment ? ` with comment: "${comment}"` : ''}`,
      user: currentUser?.role === 'admin' ? currentUser.name : 'System',
      timestamp: new Date().toISOString(),
      type: logType
    };

    setActivityLogs(prev => [newLog, ...prev]);
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