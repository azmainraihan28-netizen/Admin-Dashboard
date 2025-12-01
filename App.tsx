import React, { useState } from 'react';
import { ViewState, ServiceType, UserRole, Requisition, ActivityLog, RequisitionStatus, User } from './types';
import { CURRENT_USER, ADMIN_USER } from './constants';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Shared State
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const handleLogin = (role: UserRole) => {
    // Initialize user state based on role from constants
    if (role === 'admin') {
      setCurrentUser({ ...ADMIN_USER, role: 'admin' });
      setViewState('admin-dashboard');
    } else {
      setCurrentUser({ ...CURRENT_USER, role: 'employee' });
      setViewState('dashboard');
    }
  };

  const handleLogout = () => {
    setViewState('login');
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updatedUser });
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

  // --- Actions ---

  const handleCreateRequisition = (newRequisition: Requisition) => {
    setRequisitions(prev => [newRequisition, ...prev]);
    
    // Log creation
    const newLog: ActivityLog = {
      id: `LOG-${Math.floor(Math.random() * 10000)}`,
      action: `New requisition ${newRequisition.id} submitted by ${newRequisition.requesterName}`,
      user: newRequisition.requesterName,
      timestamp: new Date().toLocaleTimeString(),
      type: 'info'
    };
    setActivityLogs(prev => [newLog, ...prev]);
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
      user: currentUser?.role === 'admin' ? currentUser.name : 'System',
      timestamp: new Date().toLocaleTimeString(),
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