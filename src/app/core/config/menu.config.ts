import { PERMISSIONS } from '../constants/permissions.constants';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  permission?: string;
  items?: MenuItem[];
}

export const MENU_CONFIG: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    permission: PERMISSIONS.MOD_DASHBOARD,
    icon: 'home',
  },
  {
    label: 'OPD',
    icon: 'user-plus',
    items: [
      {
        label: 'Patients', // Registration
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
        label: 'Triage', // Vitals
        icon: 'heart',
        route: '/triage',
        permission: PERMISSIONS.MOD_TRIAGE,
      },
      {
        label: 'Consultation', // Doctor
        icon: 'user-edit',
        route: '/consultation',
        permission: PERMISSIONS.MOD_CONSULTATION,
      },
    ],
  },
  {
    label: 'IPD',
    icon: 'building',
    items: [
      {
        label: 'Admissions',
        route: '/ipd/admissions',
        permission: PERMISSIONS.MOD_PATIENTS, // Reusing patient permission for now or should create new? Using MOD_PATIENTS is safe for now.
        icon: 'file',
      },
      {
        label: 'Bed Management',
        route: '/ipd/beds',
        permission: PERMISSIONS.MOD_PATIENTS,
        icon: 'th-large',
      },
    ],
  },
  {
    label: 'Diagnostics',
    icon: 'search',
    items: [
      {
        label: 'Lab',
        icon: 'filter',
        route: '/lab',
        permission: PERMISSIONS.MOD_LAB,
      },
    ],
  },
  {
    label: 'Billing',
    route: '/billing',
    permission: PERMISSIONS.MOD_BILLING,
    icon: 'wallet',
  },
  {
    label: 'Administration',
    icon: 'cog',
    items: [
      {
        label: 'Users',
        route: '/admin/users',
        permission: PERMISSIONS.CMP_ADMIN_USER_READ,
        icon: 'id-card',
      },
      {
        label: 'Departments',
        route: '/admin/departments',
        permission: PERMISSIONS.CMP_ADMIN_DEPT_READ,
        icon: 'building',
      },
      {
        label: 'Roles',
        route: '/admin/roles',
        permission: PERMISSIONS.CMP_ADMIN_ROLE_WRITE,
        icon: 'lock',
      },
    ],
  },
  {
    label: 'Voice Navigation',
    route: '/voice',
    permission: PERMISSIONS.MOD_VOICE, // Or allow all for now? Using permission for consistency
    icon: 'microphone',
  },
];
