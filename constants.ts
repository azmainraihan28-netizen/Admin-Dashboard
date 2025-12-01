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
import { ServiceCategory, ServiceType } from './types';

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

export const CURRENT_USER = {
  name: "Alex Sterling",
  id: "EMP-0042",
  department: "Product Engineering",
  avatarUrl: "https://picsum.photos/200",
};

export const ADMIN_USER = {
  name: "System Administrator",
  id: "ADM-31303",
  department: "IT Operations",
  avatarUrl: "https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff",
};
