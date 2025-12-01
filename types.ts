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
  | { type: 'service'; serviceId: ServiceType };

export type UserRole = 'employee' | 'admin';

export interface User {
  name: string;
  id: string;
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
  department: string;
  date: string;
  status: RequisitionStatus;
  summary: string; // A brief description generated from form data
  comments?: string;
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
  avgProcessingTime: string; // e.g., "4h 30m"
  budgetUtilized: number; // Percentage 0-100
}