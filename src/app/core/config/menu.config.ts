import { PERMISSIONS } from '../constants/permissions.constants';

export const MENU_CONFIG = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    permission: PERMISSIONS.MOD_DASHBOARD,
    icon: 'home',
  },
  {
    label: 'Patients',
    route: '/patients',
    permission: PERMISSIONS.MOD_PATIENTS,
    icon: 'users',
  },
  {
    label: 'Appointments',
    route: '/appointments',
    permission: PERMISSIONS.MOD_APPOINTMENTS,
    icon: 'calendar',
  },
  {
    label: 'Triage',
    icon: 'heart',
    route: '/triage',
    permission: 'MOD_TRIAGE',
  },
  {
    label: 'Consultation',
    route: '/consultation',
    permission: PERMISSIONS.MOD_CONSULTATION,
    icon: 'user-edit',
  },
  {
    label: 'Lab',
    route: '/lab',
    permission: PERMISSIONS.MOD_LAB,
    icon: 'desktop',
  },
  {
    label: 'Billing',
    route: '/billing',
    permission: PERMISSIONS.MOD_BILLING,
    icon: 'wallet',
  },
  {
    label: 'Admin',
    route: '/admin',
    permission: PERMISSIONS.MOD_ADMIN,
    icon: 'cog',
  },
];
