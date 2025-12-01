import React, { useState } from 'react';
import { ViewState, ServiceType, UserRole, Requisition, ActivityLog, RequisitionStatus } from './types';
import { MOCK_REQUISITIONS, MOCK_ACTIVITY_LOG } from './constants';
import { Layout } from './components/Layout';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { ServiceRequest } from './views/ServiceRequest';
import { AdminDashboard } from './views/AdminDashboard';
import { UserProfile } from './views/UserProfile';
import { AdminReports } from './views/AdminReports';
import { AdminActivityLog } from './views/AdminActivityLog';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('login');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  // Lifted State for Admin Actions
  const [requisitions, setRequisitions] = useState<Requisition[]>(MOCK_REQUISITIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(MOCK_ACTIVITY_LOG);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'admin') {
      setViewState('admin-dashboard');
    } else {
      setViewState('dashboard');
    }
  };

  const handleLogout = () => {
    setViewState('login');
    setUserRole(null);
  };

  const handleSelectService = (serviceId: ServiceType) => {
    setViewState({ type: 'service', serviceId });
  };

  const handleBackToDashboard = () => {
    // Navigate based on role
    if (userRole === 'admin') {
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

  const handleRequisitionAction = (id: string, action: RequisitionStatus, comment?: string) => {
    // 1. Update Requisition Status and Comment
    setRequisitions(prev => prev.map(req => 
      req.id === id ? { ...req, status: action, comments: comment || req.comments } : req
    ));

    // 2. Add to Activity Log
    let logType: ActivityLog['type'] = 'info';
    if (action === 'Approved') logType = 'success';
    if (action === 'Rejected') logType = 'error';
    if (action === 'In Review') logType = 'warning';

    const newLog: ActivityLog = {
      id: `LOG-${Math.floor(Math.random() * 10000)}`,
      action: `${action} request ${id}${comment ? ` with comment: "${comment}"` : ''}`,
      user: 'Admin (31303)',
      timestamp: 'Just now',
      type: logType
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Login View (No Layout)
  if (viewState === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  // Authenticated Views (With Layout)
  return (
    <Layout 
      onLogout={handleLogout} 
      onNavigateHome={handleBackToDashboard}
      onNavigateProfile={handleNavigateProfile}
      onNavigateReports={handleNavigateReports}
      onNavigateActivityLog={handleNavigateActivityLog}
      isAdmin={userRole === 'admin'}
    >
      {viewState === 'admin-dashboard' && userRole === 'admin' && (
        <AdminDashboard 
          requisitions={requisitions} 
          onAction={handleRequisitionAction}
        />
      )}
      {viewState === 'admin-reports' && userRole === 'admin' && (
        <AdminReports />
      )}
      {viewState === 'admin-activity-log' && userRole === 'admin' && (
        <AdminActivityLog logs={activityLogs} />
      )}
      {viewState === 'dashboard' && userRole === 'employee' && (
        <Dashboard onSelectService={handleSelectService} />
      )}
      {viewState === 'profile' && userRole === 'employee' && (
        <UserProfile />
      )}
      {typeof viewState === 'object' && viewState.type === 'service' && (
        <ServiceRequest 
          serviceId={viewState.serviceId} 
          onBack={handleBackToDashboard} 
        />
      )}
    </Layout>
  );
};

export default App;