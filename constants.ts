import { 
  Shield, 
  Key, 
  Calendar, 
  Utensils, 
  Car, 
  Smartphone, 
  Brush, 
  Wrench,
} from 'lucide-react';
import { ServiceCategory, ServiceType, Requisition, ActivityLog } from './types';

export const SERVICES: ServiceCategory[] = [
  {
    id: ServiceType.SAFETY,
    title: 'Safety & Security',
    description: 'Request security guards, access control, or report safety incidents.',
    icon: Shield,
  },
  {
    id: ServiceType.KEY_SERVICES,
    title: 'Key Services',
    description: 'Courier dispatch, document handling, and secure logistics.',
    icon: Key,
  },
  {
    id: ServiceType.EVENT_MANAGEMENT,
    title: 'Event Management',
    description: 'Book venues, organize corporate events, and catering setups.',
    icon: Calendar,
  },
  {
    id: ServiceType.CANTEEN,
    title: 'Staff Canteen',
    description: 'Meal vouchers, new employee registration, and guest catering.',
    icon: Utensils,
  },
  {
    id: ServiceType.TRANSPORT,
    title: 'Transport',
    description: 'Schedule pick-up/drop-off services or ad-hoc vehicle requests.',
    icon: Car,
  },
  {
    id: ServiceType.COMMUNICATIONS,
    title: 'Communications',
    description: 'SIM cards, data bundles, and mobile device provisioning.',
    icon: Smartphone,
  },
  {
    id: ServiceType.HOUSEKEEPING,
    title: 'Housekeeping',
    description: 'Cleaning services, office supplies, and pantry support.',
    icon: Brush,
  },
  {
    id: ServiceType.MAINTENANCE,
    title: 'Maintenance',
    description: 'Repairs for civil works, plumbing, washrooms, or office fixtures.',
    icon: Wrench,
  },
];

// Using valid UUIDs for Supabase compatibility
export const CURRENT_USER = {
  name: "Alex Sterling",
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", 
  staffId: "EMP-0042",
  department: "Product Engineering",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

export const ADMIN_USER = {
  name: "System Administrator",
  id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
  staffId: "ADM-31303",
  department: "IT Operations",
  avatarUrl: "https://ui-avatars.com/api/?name=System+Admin&background=00A55D&color=fff",
};

export const MOCK_REQUISITIONS: Requisition[] = [
  {
    id: 'REQ-1024',
    serviceId: ServiceType.SAFETY,
    requesterName: 'Alex Sterling',
    requesterId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    requesterStaffId: 'EMP-0042',
    department: 'Product Engineering',
    date: '2024-03-10',
    status: 'Pending',
    summary: 'armed guard for Building A, Main Entrance (8 hours)',
    formData: { location: 'Building A, Main Entrance', guardType: 'armed', duration: '8 hours' }
  },
  {
    id: 'REQ-1023',
    serviceId: ServiceType.TRANSPORT,
    requesterName: 'Sarah Chen',
    requesterId: 'uuid-sarah',
    requesterStaffId: 'EMP-0043',
    department: 'Marketing',
    date: '2024-03-09',
    status: 'In Review',
    summary: 'pickup to Airport Terminal 3 on 2024-03-12',
    comments: 'Checking driver availability',
    formData: { transportReqType: 'pickup', destination: 'Airport Terminal 3', transportDate: '2024-03-12', transportTime: '08:00' }
  },
  {
    id: 'REQ-1022',
    serviceId: ServiceType.CANTEEN,
    requesterName: 'Alex Sterling',
    requesterId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    requesterStaffId: 'EMP-0042',
    department: 'Product Engineering',
    date: '2024-03-08',
    status: 'Approved',
    summary: 'New Staff Meal Plan: John Doe',
    formData: { canteenTab: 'new_emp', empName: 'John Doe', staffId: 'EMP-9988', dietaryPref: 'vegetarian' }
  },
  {
    id: 'REQ-1021',
    serviceId: ServiceType.MAINTENANCE,
    requesterName: 'Mike Ross',
    requesterId: 'uuid-mike',
    requesterStaffId: 'EMP-0050',
    department: 'Facilities',
    date: '2024-03-07',
    status: 'Rejected',
    summary: 'civil maintenance at 2nd Floor Corridor',
    comments: 'Duplicate request. Work already scheduled.',
    formData: { maintenanceType: 'civil', location: '2nd Floor Corridor', description: 'Cracked tile repair' }
  },
  {
    id: 'REQ-1020',
    serviceId: ServiceType.KEY_SERVICES,
    requesterName: 'Jessica Pearson',
    requesterId: 'uuid-jessica',
    requesterStaffId: 'EMP-0045',
    department: 'Legal',
    date: '2024-03-06',
    status: 'Approved',
    summary: 'Courier service to Pearson Hardman HQ',
    formData: { keyServiceType: 'courier', receiverName: 'Harvey Specter', destination: 'Pearson Hardman HQ' }
  },
   {
    id: 'REQ-1019',
    serviceId: ServiceType.COMMUNICATIONS,
    requesterName: 'Alex Sterling',
    requesterId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    requesterStaffId: 'EMP-0042',
    department: 'Product Engineering',
    date: '2024-03-05',
    status: 'Pending',
    summary: 'New SIM Card Request',
    formData: { commType: 'sim', justification: 'New project phone' }
  }
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'LOG-501',
    action: 'Approved request REQ-1022',
    user: 'System Administrator',
    timestamp: '2024-03-08T10:30:00Z',
    type: 'success'
  },
  {
    id: 'LOG-500',
    action: 'New requisition REQ-1024 submitted by Alex Sterling',
    user: 'Alex Sterling',
    timestamp: '2024-03-10T09:15:00Z',
    type: 'info'
  },
  {
    id: 'LOG-499',
    action: 'Rejected request REQ-1021 with comment: "Duplicate request."',
    user: 'System Administrator',
    timestamp: '2024-03-07T14:20:00Z',
    type: 'error'
  },
  {
    id: 'LOG-498',
    action: 'Updated status of REQ-1023 to In Review',
    user: 'System Administrator',
    timestamp: '2024-03-09T11:00:00Z',
    type: 'warning'
  }
];