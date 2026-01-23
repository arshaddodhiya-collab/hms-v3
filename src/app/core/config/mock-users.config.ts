import { PERMISSIONS } from '../constants/permissions.constants';

export interface MockUser {
  username: 'admin' | 'doctor' | 'nurse' | 'lab' | 'reception';
  password: '123';
  role: string;
  permissions: string[];
}

export const MOCK_USERS: MockUser[] = [
  {
    username: 'admin',
    password: '123',
    role: 'Administrator',
    permissions: [
      PERMISSIONS.MOD_DASHBOARD,
      PERMISSIONS.MOD_PATIENTS,
      PERMISSIONS.MOD_APPOINTMENTS,
      PERMISSIONS.MOD_TRIAGE,
      PERMISSIONS.MOD_CONSULTATION,
      PERMISSIONS.MOD_LAB,
      PERMISSIONS.MOD_BILLING,
      PERMISSIONS.MOD_ADMIN,
      PERMISSIONS.ACT_VIEW,
      PERMISSIONS.ACT_CREATE,
      PERMISSIONS.ACT_EDIT,
      PERMISSIONS.ACT_DELETE,
    ],
  },
  {
    username: 'doctor',
    password: '123',
    role: 'Doctor',
    permissions: [
      PERMISSIONS.MOD_DASHBOARD,
      PERMISSIONS.MOD_PATIENTS,
      PERMISSIONS.MOD_APPOINTMENTS,
      PERMISSIONS.MOD_TRIAGE, // View triage info
      PERMISSIONS.MOD_CONSULTATION, // Core work
      PERMISSIONS.ACT_VIEW,
      PERMISSIONS.ACT_CREATE, // Prescriptions, etc
      PERMISSIONS.ACT_EDIT,
    ],
  },
  {
    username: 'nurse',
    password: '123',
    role: 'Nurse',
    permissions: [
      PERMISSIONS.MOD_DASHBOARD,
      PERMISSIONS.MOD_PATIENTS,
      PERMISSIONS.MOD_APPOINTMENTS, // View schedule
      PERMISSIONS.MOD_TRIAGE, // Core work
      PERMISSIONS.ACT_VIEW,
      PERMISSIONS.ACT_CREATE, // Vitals
    ],
  },
  {
    username: 'lab',
    password: '123',
    role: 'Lab Technician',
    permissions: [
      PERMISSIONS.MOD_DASHBOARD,
      PERMISSIONS.MOD_LAB, // Core work
      PERMISSIONS.MOD_PATIENTS, // View basics
      PERMISSIONS.ACT_VIEW,
      PERMISSIONS.ACT_CREATE, // Results
      PERMISSIONS.CMP_LAB_ENTRY,
    ],
  },
  {
    username: 'reception',
    password: '123',
    role: 'Front Desk',
    permissions: [
      PERMISSIONS.MOD_DASHBOARD,
      PERMISSIONS.MOD_PATIENTS, // Registration
      PERMISSIONS.MOD_APPOINTMENTS, // Scheduling
      PERMISSIONS.MOD_BILLING, // Payments
      PERMISSIONS.ACT_VIEW,
      PERMISSIONS.ACT_CREATE,
      PERMISSIONS.ACT_EDIT,
      PERMISSIONS.CMP_PATIENT_ADD,
    ],
  },
];
