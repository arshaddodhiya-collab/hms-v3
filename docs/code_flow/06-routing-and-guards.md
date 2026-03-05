# 06 — Routing & Guards

## Top-Level Routes (`app-routing.module.ts`)

All feature modules are **lazy-loaded** using `loadChildren`. The app also uses a **two-layer guard system**: `AuthGuard` (authentication) and `PermissionGuard` (authorization).

| Path | Module | Guards | Permission | Notes |
|------|--------|--------|------------|-------|
| `/auth/**` | `AuthModule` | None | — | Public (login page) |
| `/dashboard` | `DashboardModule` | `AuthGuard` | — | No permission needed, just auth |
| `/patients/**` | `PatientsModule` | `AuthGuard, PermissionGuard` | `MOD_PATIENTS` | |
| `/appointments/**` | `AppointmentsModule` | `AuthGuard, PermissionGuard` | `MOD_APPOINTMENTS` | |
| `/triage/**` | `TriageModule` | `AuthGuard, PermissionGuard` | `MOD_TRIAGE` | |
| `/consultation/**` | `ConsultationModule` | `AuthGuard, PermissionGuard` | `MOD_CONSULTATION` | |
| `/lab/**` | `LabModule` | `AuthGuard, PermissionGuard` | `MOD_LAB` | |
| `/ipd/**` | `IpdModule` | `AuthGuard, PermissionGuard` | `MOD_PATIENTS` | Reuses patient permission |
| `/billing/**` | `BillingModule` | `AuthGuard, PermissionGuard` | `MOD_BILLING` | |
| `/admin/**` | `AdminModule` | `AuthGuard, PermissionGuard` | `MOD_ADMIN` | |
| `/error/**` | `ErrorModule` | None | — | Public error pages |
| `/voice` | `VoiceNavigationModule` | `AuthGuard, PermissionGuard` | `MOD_VOICE` | |
| ` ` (empty) | — | — | — | Redirects to `/auth/login` |
| `**` (wildcard) | — | — | — | Redirects to `/error/not-found` |

---

## Child Routes by Module

### Auth Routes
```
/auth/login     → LoginComponent
/auth           → redirects to /auth/login
```

### Dashboard Routes
```
/dashboard      → DashboardComponent
```

### Patient Routes
```
/patients                → PatientListComponent      (CMP_PATIENT_LIST)
/patients/register       → PatientRegisterComponent  (CMP_PATIENT_ADD)
/patients/:id            → PatientViewComponent      (CMP_PATIENT_VIEW)
/patients/:id/edit       → PatientEditComponent      (CMP_PATIENT_EDIT)
```

### Appointment Routes
```
/appointments            → AppointmentListComponent    (CMP_APPOINTMENT_LIST)
/appointments/create     → AppointmentCreateComponent  (CMP_APPOINTMENT_CREATE)
/appointments/edit/:id   → AppointmentEditComponent    (CMP_APPOINTMENT_EDIT)
/appointments/:id        → AppointmentViewComponent    (CMP_APPOINTMENT_VIEW)
```

### Triage Routes
```
/triage                       → TriageQueueComponent   (MOD_TRIAGE)
/triage/list                  → TriageListComponent    (MOD_TRIAGE)
/triage/vitals/:encounterId   → VitalsEntryComponent   (CMP_VITALS_WRITE)
/triage/view/:appointmentId   → VitalsViewComponent    (CMP_VITALS_READ)
```

### Consultation Routes
```
/consultation                              → ConsultationListComponent   (MOD_CONSULTATION)
/consultation/:encounterId                 → ConsultationDetailComponent (CMP_CONSULTATION_WRITE)
/consultation/by-appointment/:appointmentId → ConsultationDetailComponent (CMP_CONSULTATION_WRITE)
```

### Lab Routes
```
/lab                     → LabRequestListComponent  (MOD_LAB)
/lab/request             → TestRequestComponent     (MOD_LAB)
/lab/entry/:requestId    → LabTestEntryComponent    (CMP_LAB_ENTRY)
/lab/view/:requestId     → LabReportViewComponent   (CMP_LAB_READ)
```

### IPD Routes
```
/ipd                         → redirects to /ipd/admissions
/ipd/admissions              → AdmissionListComponent
/ipd/beds                    → BedManagementComponent
/ipd/admit                   → AdmissionFormComponent
/ipd/discharge/:admissionId  → DischargeSummaryComponent
```

### Billing Routes
```
/billing                → BillingSummaryComponent    (MOD_BILLING)
/billing/invoice/new     → InvoiceGenerateComponent  (CMP_INVOICE_GENERATE)
/billing/receipt/:id     → PaymentReceiptComponent   (CMP_PAYMENT_RECEIPT)
```

### Admin Routes
```
/admin               → redirects to /admin/users
/admin/users          → UserListComponent            (CMP_ADMIN_USER_READ)
/admin/departments    → DepartmentListComponent      (CMP_ADMIN_DEPT_READ)
/admin/roles          → RolePermissionComponent      (CMP_ADMIN_ROLE_WRITE)
```

### Voice Navigation Routes
```
/voice               → VoiceNavigationComponent
```

### Error Routes
```
/error/not-found      → NotFoundComponent
/error/unauthorized   → UnauthorizedComponent
/error/server-error   → ServerErrorComponent
```

---

## Guard System

### AuthGuard — Authentication Check

```typescript
canActivate(): boolean {
  if (this.authService.isAuthenticated()) {
    return true;                          // ✅ User is logged in
  }
  this.router.navigate(['/auth/login']); // ❌ Redirect to login
  return false;
}
```

**Where it's used**: All routes except `/auth/**` and `/error/**`

---

### PermissionGuard — Authorization Check

```typescript
canActivate(route: ActivatedRouteSnapshot): boolean {
  const requiredPermission = route.data['permission'];

  if (!requiredPermission) return true;   // No permission needed

  if (this.authService.hasPermission(requiredPermission)) {
    return true;                          // ✅ User has permission
  }

  this.messageService.add({              // ❌ Show error toast
    severity: 'error',
    summary: 'Access Denied',
    detail: 'You do not have permission',
  });
  return false;
}
```

**Where it's used**: All feature routes (except auth, dashboard, error)

---

## Route Protection Flow

```
User clicks sidebar link to /patients
    │
    ├── Angular Router checks canActivate guards (in order)
    │
    ├── 1. AuthGuard
    │   ├── isAuthenticated()? YES → Continue to next guard
    │   └── NO → Navigate to /auth/login, return false
    │
    ├── 2. PermissionGuard
    │   ├── route.data['permission'] = 'MOD_PATIENTS'
    │   ├── hasPermission('MOD_PATIENTS')? YES → Load module
    │   └── NO → Show "Access Denied" toast, return false
    │
    └── Module lazily loaded → Child routes resolve
        │
        └── Child PermissionGuard (e.g., CMP_PATIENT_LIST)
            ├── YES → Render component
            └── NO → Access denied
```

---

## Permission Hierarchy

The permission system has three tiers that work together:

```
                     MOD_PATIENTS (module-level)
                         │
            ┌────────────┼────────────────┐
            │            │                │
     CMP_PATIENT_ADD  CMP_PATIENT_LIST  CMP_PATIENT_VIEW  CMP_PATIENT_EDIT
     (component)      (component)        (component)       (component)
            │
            │
     ACT_CREATE (action-level)
```

- **Module permissions** (`MOD_*`) — Control access to the entire feature module route
- **Component permissions** (`CMP_*`) — Control access to specific child routes within a module
- **Action permissions** (`ACT_*`) — Control specific operations (create, edit, delete)

---

## Role → Permission Mapping

| Permission | Admin | Doctor | Nurse | Lab Tech | Reception |
|-----------|:-----:|:------:|:-----:|:--------:|:---------:|
| `MOD_DASHBOARD` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `MOD_PATIENTS` | ✅ | ✅ | ✅ | — | ✅ |
| `MOD_APPOINTMENTS` | ✅ | ✅ | ✅ | — | ✅ |
| `MOD_TRIAGE` | ✅ | — | ✅ | — | — |
| `MOD_CONSULTATION` | ✅ | ✅ | ✅ | — | — |
| `MOD_LAB` | ✅ | — | — | ✅ | — |
| `MOD_BILLING` | ✅ | — | — | — | ✅ |
| `MOD_ADMIN` | ✅ | — | — | — | — |
| `MOD_VOICE` | ✅ | — | — | — | — |
| `CMP_VITALS_WRITE` | ✅ | — | ✅ | — | — |
| `CMP_VITALS_READ` | ✅ | ✅ | ✅ | — | — |
| `CMP_CONSULTATION_WRITE` | ✅ | ✅ | — | — | — |
| `CMP_CONSULTATION_READ` | ✅ | ✅ | ✅ | — | — |
| `CMP_LAB_ENTRY` | ✅ | — | — | ✅ | — |
| `CMP_LAB_READ` | ✅ | ✅ | ✅ | ✅ | — |
| `ACT_CREATE` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `ACT_EDIT` | ✅ | ✅ | — | — | ✅ |
| `ACT_DELETE` | ✅ | — | — | — | — |
