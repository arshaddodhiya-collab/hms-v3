# 07 — Models & Interfaces

> **Path**: `src/app/core/models/` (shared) and `src/app/features/*/models/` (feature-specific)

This document lists all TypeScript interfaces, enums, and data contracts used in the application.

---

## Core Models (`core/models/`)

### Patient (`patient.model.ts`)

```typescript
interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  name?: string;              // Client-side computed: firstName + lastName
  dob: string;                // ISO date string
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  contact: string;
  email?: string;
  address?: string;
  allergies?: string;
  avatar?: string;
  lastVisit?: string;
  medicalHistory?: MedicalHistory[];
}

interface MedicalHistory {
  id: number;
  condition: string;
  diagnosedDate: string;
  status: 'ONGOING' | 'HEALED' | 'CHRONIC';
}
```

### Enums (`patient.model.ts`)

```typescript
enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

enum EncounterStatus {
  TRIAGE = 'TRIAGE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

enum AdmissionStatus {
  ADMITTED = 'ADMITTED',
  DISCHARGED = 'DISCHARGED',
  TRANSFERRED = 'TRANSFERRED',
}
```

### Visit (`patient.model.ts`)

```typescript
interface Visit {
  id: number;
  patientId: number;
  patientName: string;
  appointmentTime: Date;
  status: AppointmentStatus;
  doctorName?: string;
  department?: string;
  triageData?: any;
  diagnosis?: string;
}
```

### Bed (`patient.model.ts`)

```typescript
interface Bed {
  id: number;
  ward: { id: number; name: string };
  number: string;
  isOccupied: boolean;
  type: string;
  patientName?: string;
}
```

### Admission (`patient.model.ts`)

```typescript
interface Admission {
  id: number;
  patientId: number;
  patientName: string;
  admissionDate: Date;
  dischargeDate?: Date;
  status: AdmissionStatus;
  bed: Bed;                  // Nested bed with ward info
  doctorId: number;
  doctorName: string;
  diagnosis?: string;
  dischargeSummary?: string;
  advice?: string;
}
```

---

### Encounter (`encounter.model.ts`)

```typescript
interface EncounterResponse {
  id: number;
  appointmentId?: number;
  admissionId?: number;
  patientId: number;
  patientName: string;
  patientGender?: string;
  patientDob?: string;
  doctorId: number;
  doctorName: string;
  status: 'TRIAGE' | 'IN_PROGRESS' | 'COMPLETED';
  chiefComplaint?: string;
  diagnosis?: string;
  notes?: string;
  startedAt: string;
  visitedAt?: string;
  vitals?: VitalsResponse;
  vitalsHistory?: VitalsResponse[];
  rounds?: RoundResponse[];
}

interface RoundResponse {
  id: number;
  encounterId: number;
  doctorId: number;
  doctorName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface EncounterCreateRequest {
  appointmentId: number;
  patientId: number;
  doctorId: number;
}

interface EncounterUpdateRequest {
  chiefComplaint?: string;
  diagnosis?: string;
  notes?: string;
}
```

---

### Vitals (`vitals.model.ts`)

```typescript
interface VitalsRequest {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
}

interface VitalsResponse {
  id: number;
  encounterId: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
  recordedAt: string;
}
```

---

### Prescription (`prescription.model.ts`)

```typescript
interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface PrescriptionRequest {
  items: PrescriptionItem[];
  note?: string;
}

interface PrescriptionResponse {
  id: number;
  encounterId: number;
  items: PrescriptionItem[];
  note?: string;
  prescribedAt: string;
}
```

---

### Lab (`lab.models.ts`)

```typescript
interface LabRequest {
  id: number;
  encounterId: number;
  patientId: number;
  patientName: string;
  doctorName: string;
  status: LabRequestStatus;
  tests: LabTestResult[];
  requestedAt: string;
  completedAt?: string;
}

interface LabTest {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface CreateLabRequest {
  encounterId: number;
  testIds: number[];
}

enum LabRequestStatus {
  ORDERED = 'ORDERED',
  SAMPLED = 'SAMPLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

interface AddLabResultRequest {
  testId: number;
  result: string;
  normalRange: string;
  unit: string;
  isAbnormal: boolean;
}
```

---

### Page (`page.model.ts`)

Generic paginated response wrapper matching Spring Boot's `Page<T>`:

```typescript
interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;           // Current page (0-indexed)
}
```

---

### Department (`department.model.ts`)

```typescript
interface Department {
  id: number;
  name: string;
  description?: string;
}
```

---

### User (`user.model.ts`)

```typescript
interface User {
  id: number;
  username: string;
  role: string;
  permissions: string[];
}
```

---

### Menu Item (`menu.model.ts`)

```typescript
interface MenuItem {
  label: string;
  icon: string;
  route?: string;           // Router link (absent for parent-only groups)
  permission?: string;      // Permission string for filtering
  items?: MenuItem[];       // Nested sub-menu items
}
```

---

### Auth User (`auth/services/auth.service.ts`)

```typescript
interface User {
  id: number;
  username: string;
  role: string;
  permissions: string[];
}
```

---

## Feature-Specific Models

### Appointment (`features/appointments/models/appointment.model.ts`)

```typescript
interface AppointmentRequest {
  patientId: number;
  doctorId: number;
  departmentId?: number;
  startDateTime: string;     // ISO datetime
  reason?: string;
}

interface AppointmentResponse {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  departmentName?: string;
  startDateTime: string;
  endDateTime?: string;
  status: AppointmentStatus;
  reason?: string;
  cancellationReason?: string;
}
```

### Billing (`features/billing/models/billing.models.ts`)

```typescript
interface InvoiceResponse {
  id: number;
  patientId: number;
  patientName: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  items: InvoiceItem[];
  createdAt: string;
}

interface InvoiceRequest {
  patientId: number;
  encounterId?: number;
  items: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PaymentRequest {
  invoiceId: number;
  amount: number;
  method: 'CASH' | 'CARD' | 'UPI' | 'INSURANCE';
}

interface PaymentResponse {
  id: number;
  invoiceId: number;
  amount: number;
  method: string;
  receiptNumber: string;
  paidAt: string;
}

interface BillingSummaryResponse {
  totalInvoices: number;
  totalRevenue: number;
  totalOutstanding: number;
}
```

---

## Model Relationships

```
Patient ─────┬──── Appointment ──── Encounter ──── Vitals
             │                          │
             │                          ├──── Prescription
             │                          │
             │                          ├──── LabRequest ──── LabTestResults
             │                          │
             │                          └──── Rounds (IPD)
             │
             ├──── Admission ──── Bed ──── Ward
             │
             └──── MedicalHistory

Invoice ──── InvoiceItems
   │
   └──── Payment

User ──── Role ──── Permissions

Department
```
