import { LucideIcon } from 'lucide-react';

export enum ServiceType {
  SAFETY = 'safety',
  KEY_SERVICES = 'key_services',
  EVENT_MANAGEMENT = 'events',
  CANTEEN = 'canteen',
  TRANSPORT = 'transport',
  COMMUNICATIONS = 'communications',
  HOUSEKEEPING = 'housekeeping',
  MAINTENANCE = 'maintenance',
}

export interface ServiceCategory {
  id: ServiceType;
  title: string;
  description: string;
  icon: LucideIcon;
}

export type ViewState = 
  | 'login' 
  | 'dashboard' 
  | 'admin-dashboard'
  | 'admin-reports'
  | 'admin-activity-log'
  | 'profile'
  | 'admin-employees'
  | { type: 'service'; serviceId: ServiceType };

export type UserRole = 'employee' | 'admin' | 'editor' | 'viewer';

export interface User {
  name: string;
  id: string;
  staffId?: string; // Human readable ID (EMP-001)
  department: string;
  avatarUrl: string;
  role: UserRole;
}

export type RequisitionStatus = 'Pending' | 'Approved' | 'Rejected' | 'In Review';

export interface Requisition {
  id: string;
  serviceId: ServiceType;
  requesterName: string;
  requesterId: string;
  requesterStaffId?: string; // Added for Admin Review visibility
  department: string;
  date: string;
  status: RequisitionStatus;
  summary: string;
  comments?: string;
  formData?: any; // Stores the specific form inputs (JSON)
  attachments?: any[]; // Stores file references
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface YearlyStat {
  serviceId: ServiceType;
  totalRequests: number;
  approved: number;
  rejected: number;
  pending: number;
  avgProcessingTime: string;
  budgetUtilized: number;
}