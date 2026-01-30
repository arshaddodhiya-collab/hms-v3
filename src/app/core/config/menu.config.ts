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
    permission: PERMISSIONS.MOD_TRIAGE,
  },
  {
    label: 'Consultation',
    icon: 'user-edit',
    route: '/consultation',
    permission: PERMISSIONS.MOD_CONSULTATION,
  },
  {
    label: 'Lab',
    icon: 'filter',
    route: '/lab',
    permission: PERMISSIONS.MOD_LAB,
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
