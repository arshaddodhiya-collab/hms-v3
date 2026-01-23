import { PERMISSIONS } from '../constants/permissions.constants';

export const MENU_CONFIG = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    permission: PERMISSIONS.MOD_DASHBOARD,
    icon: 'dashboard',
  },
  {
    label: 'Patients',
    route: '/patients',
    permission: PERMISSIONS.MOD_PATIENTS,
    icon: 'people',
  },
  {
    label: 'Appointments',
    route: '/appointments',
    permission: PERMISSIONS.MOD_APPOINTMENTS,
    icon: 'event',
  },
  {
    label: 'Triage',
    route: '/triage',
    permission: PERMISSIONS.MOD_TRIAGE,
    icon: 'monitor_heart',
  },
  {
    label: 'Consultation',
    route: '/consultation',
    permission: PERMISSIONS.MOD_CONSULTATION,
    icon: 'medical_services',
  },
  {
    label: 'Lab',
    route: '/lab',
    permission: PERMISSIONS.MOD_LAB,
    icon: 'science',
  },
  {
    label: 'Billing',
    route: '/billing',
    permission: PERMISSIONS.MOD_BILLING,
    icon: 'payments',
  },
  {
    label: 'Admin',
    route: '/admin',
    permission: PERMISSIONS.MOD_ADMIN,
    icon: 'admin_panel_settings',
  },
];
