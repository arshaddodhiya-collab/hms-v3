# 04 — Feature Modules

> **Path**: `src/app/features/`
> All feature modules are **lazy-loaded** via `loadChildren` in `app-routing.module.ts`

Each feature module follows a consistent internal structure:
```
feature-name/
├── feature-name.module.ts           # NgModule declaration
├── feature-name-routing.module.ts   # Child routes
├── services/                        # HTTP service layer
│   └── feature.service.ts
├── facades/                         # Signal-based state management
│   └── feature.facade.ts
├── models/                          # Feature-specific interfaces (if any)
│   └── feature.model.ts
└── components/                      # Feature UI components
    ├── component-a/
    │   ├── component-a.component.ts
    │   ├── component-a.component.html
    │   └── component-a.component.scss
    └── component-b/
```

---

## 1. Auth Module

> **Path**: `features/auth/` · **Route**: `/auth/**` · **No guard** (public)

### Purpose
Handles user authentication — login and session management.

### Components

| Component | Route | Purpose |
|-----------|-------|---------|
| `LoginComponent` | `/auth/login` | Login form with username/password |

### Services

**`AuthService`** — Singleton authentication service (used by guards, interceptors, and all modules)

| Method | Description |
|--------|-------------|
| `loadCurrentUser()` | Calls `GET /auth/me` to restore session from cookie |
| `login(credentials)` | `POST /auth/login` — sets cookie, emits user to `currentUser$` |
| `logout()` | `POST /auth/logout` — clears user, redirects to login |
| `isAuthenticated()` | Returns `true` if `currentUserSubject.value` is not null |
| `hasPermission(perm)` | Checks if user's permissions array includes the string |
| `getUserRole()` | Returns current user's role string |
| `getCurrentUser()` | Returns current user object |

**`MockAuthService`** — Alternative service for offline development without backend.

### Authentication Flow
```
App Init → AuthService.constructor()
    │
    └── loadCurrentUser() → GET /auth/me
        ├── 200 + User data → currentUserSubject.next(user)
        │   └── App shows dashboard with user's permissions
        └── Error (no session) → currentUserSubject.next(null)
            └── User sees login page

User submits login form → POST /auth/login
    ├── 200 → currentUserSubject.next(user) → Navigate to /dashboard
    └── Error → Show error toast
```

---

## 2. Dashboard Module

> **Path**: `features/dashboard/` · **Route**: `/dashboard` · **Guard**: AuthGuard

### Purpose
Landing page after login showing statistics, recent activity, and (for doctors) upcoming appointments.

### Components

| Component | Route | Purpose |
|-----------|-------|---------|
| `DashboardComponent` | `/dashboard` | Main dashboard view |
| `StatsCardsComponent` | (child) | Statistics cards (patients, appointments, etc.) |
| `TodayActivityComponent` | (child) | Recent activity feed |

### Facade: `DashboardFacade`

**Signals:**
- `stats` — Dashboard statistics DTO
- `activities` — Recent activity list
- `myAppointments` — Doctor's upcoming appointments
- `loading`, `userRole`, `username`

**Key methods:**
| Method | Description |
|--------|-------------|
| `loadDashboard()` | Loads stats + activities, loads doctor appointments if role is Doctor |
| `logout()` | Delegates to `AuthService.logout()` |

---

## 3. Patients Module

> **Path**: `features/patients/` · **Route**: `/patients/**` · **Guard**: AuthGuard + PermissionGuard (`MOD_PATIENTS`)

### Purpose
Patient registration, search, view details, edit, and delete.

### Components

| Component | Route | Permission | Purpose |
|-----------|-------|------------|---------|
| `PatientListComponent` | `/patients` | `CMP_PATIENT_LIST` | Searchable patient table |
| `PatientRegisterComponent` | `/patients/register` | `CMP_PATIENT_ADD` | Registration form |
| `PatientViewComponent` | `/patients/:id` | `CMP_PATIENT_VIEW` | Patient detail view |
| `PatientEditComponent` | `/patients/:id/edit` | `CMP_PATIENT_EDIT` | Edit patient form |
| `MedicalHistoryComponent` | (child) | — | Medical history sub-view |

### Service: `PatientService`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getPatients(query?, page, size)` | `GET /patients?query=&page=&size=` | Paginated search |
| `getPatientById(id)` | `GET /patients/{id}` | Single patient detail |
| `registerPatient(patient)` | `POST /patients` | Create new patient |
| `updatePatient(id, patient)` | `PUT /patients/{id}` | Update patient |
| `deletePatient(id)` | `DELETE /patients/{id}` | Delete patient |
| `calculateAge(dob)` | — | Client-side age calculation |

### Facade: `PatientFacade`

Extends `BaseFacade<Patient>` with additional signals:
- `patients` — Patient list
- `selectedPatient` — Currently viewed patient
- `totalRecords` — Total count for pagination
- `saving` — Save operation in progress

---

## 4. Appointments Module

> **Path**: `features/appointments/` · **Route**: `/appointments/**` · **Guard**: AuthGuard + PermissionGuard (`MOD_APPOINTMENTS`)

### Purpose
Appointment scheduling, lifecycle management (check-in → consult → complete/no-show/cancel).

### Components

| Component | Route | Permission | Purpose |
|-----------|-------|------------|---------|
| `AppointmentListComponent` | `/appointments` | `CMP_APPOINTMENT_LIST` | Appointment table |
| `AppointmentCreateComponent` | `/appointments/create` | `CMP_APPOINTMENT_CREATE` | Book new appointment |
| `AppointmentEditComponent` | `/appointments/edit/:id` | `CMP_APPOINTMENT_EDIT` | Edit appointment |
| `AppointmentViewComponent` | `/appointments/:id` | `CMP_APPOINTMENT_VIEW` | View details |

### Service: `AppointmentService`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAppointments()` | `GET /appointments` | All appointments |
| `getAppointmentsByDate(date)` | `GET /appointments/today` | Today's appointments |
| `getAppointmentById(id)` | `GET /appointments/{id}` | Single appointment |
| `getDoctorAppointments(doctorId, date)` | `GET /appointments/doctor/{id}?date=` | Doctor's schedule |
| `createAppointment(appt)` | `POST /appointments/book` | Book appointment |
| `updateAppointment(id, appt)` | `PUT /appointments/{id}` | Update appointment |
| `cancelAppointment(id, reason)` | `PUT /appointments/{id}/cancel` | Cancel with reason |
| `checkInAppointment(id)` | `PUT /appointments/{id}/check-in` | Mark patient arrived |
| `startConsultation(id)` | `PUT /appointments/{id}/start` | Begin consultation |
| `completeAppointment(id)` | `PUT /appointments/{id}/complete` | Complete visit |
| `markNoShow(id)` | `PUT /appointments/{id}/no-show` | Patient didn't arrive |
| `restoreAppointment(id)` | `PUT /appointments/{id}/restore` | Uncancel/un-no-show |
| `getPatientAppointments(patientId, status?)` | `GET /appointments/patient/{id}?status=` | Patient's history |
| `getUpcomingAppointmentsForDoctor(doctorId)` | `GET /appointments/doctor/{id}/upcoming` | Future appointments |

### Facade: `AppointmentFacade`

Extends `BaseFacade<AppointmentResponse>` with:
- `appointments`, `selectedAppointment`, `saving`
- `todaysAppointments` — Computed signal filtering by today's date
- Lifecycle methods: `checkIn()`, `cancel()`, `startConsultation()`, `complete()`, `markNoShow()`, `restore()`

### Appointment Lifecycle
```
SCHEDULED → CHECKED_IN → IN_PROGRESS → COMPLETED
     │           │
     │           └───────────────────→ NO_SHOW
     └───────────────────────────────→ CANCELLED
                                          │
                                          └→ RESTORE → SCHEDULED
```

---

## 5. Triage Module

> **Path**: `features/triage/` · **Route**: `/triage/**` · **Guard**: AuthGuard + PermissionGuard (`MOD_TRIAGE`)

### Purpose
Nurse triage workflow — record patient vitals (blood pressure, temperature, heart rate, etc.) for checked-in patients.

### Components

| Component | Route | Permission | Purpose |
|-----------|-------|------------|---------|
| `TriageQueueComponent` | `/triage` | `MOD_TRIAGE` | Queue of patients awaiting triage |
| `TriageListComponent` | `/triage/list` | `MOD_TRIAGE` | List view of all triage records |
| `VitalsEntryComponent` | `/triage/vitals/:encounterId` | `CMP_VITALS_WRITE` | Record vitals form |
| `VitalsViewComponent` | `/triage/view/:appointmentId` | `CMP_VITALS_READ` | View recorded vitals |

### Service: `TriageService`

Handles encounter queue and vitals CRUD operations.

### Facade: `TriageFacade`

Extends `BaseFacade<EncounterResponse>` with:
- `queue` — Triage encounter queue
- `selectedEncounter`, `vitals`, `saving`
- `loadQueue()`, `loadEncounterByAppointmentId()`, `saveVitals()`, `loadVitals()`

---

## 6. Consultation Module

> **Path**: `features/consultation/` · **Route**: `/consultation/**` · **Guard**: AuthGuard + PermissionGuard (`MOD_CONSULTATION`)

### Purpose
Doctor consultation workflow — view patient queue, add diagnosis, write prescriptions, complete encounters.

### Components

| Component | Route | Permission | Purpose |
|-----------|-------|------------|---------|
| `ConsultationListComponent` | `/consultation` | `MOD_CONSULTATION` | Doctor's OPD queue |
| `ConsultationDetailComponent` | `/consultation/:encounterId` | `CMP_CONSULTATION_WRITE` | Consultation workspace |
| `ConsultationDetailComponent` | `/consultation/by-appointment/:appointmentId` | `CMP_CONSULTATION_WRITE` | Start from appointment |
| `ConsultationHistoryComponent` | (child) | — | Patient's consultation history |
| `DiagnosisNotesComponent` | (child) | — | Chief complaint, diagnosis, notes |
| `PrescriptionComponent` | (child) | — | Prescription management |

### Service: `EncounterService`

Manages encounters (medical visits), clinical notes, and prescriptions.

### Facade: `ConsultationFacade`

**Does not extend BaseFacade** — has its own Signal structure:
- `encounter`, `doctorQueue`, `prescription`, `loading`, `saving`
- `queueCount` — Computed patient count
- `prescriptionItems` — Computed from prescription signal

**Key methods:**
| Method | Description |
|--------|-------------|
| `loadDoctorQueue(doctorId?)` | Load encounters assigned to current doctor |
| `loadEncounterById(id)` | Load encounter + auto-load prescription |
| `startEncounterFromAppointment(appointmentId)` | Create encounter from appointment, mark appointment as started |
| `updateClinicalNotes(encounterId, data)` | Save diagnosis, complaint, notes |
| `savePrescription(encounterId, items)` | Save prescription items |
| `finishConsultation(encounterId, data)` | Save notes + complete encounter (chained with `switchMap`) |

### Consultation Flow
```
Doctor opens queue → loadDoctorQueue()
    │
    ├── Clicks patient → startEncounterFromAppointment(appointmentId)
    │   ├── GET appointment details
    │   └── POST create encounter → Navigate to detail view
    │
    ├── Records diagnosis → updateClinicalNotes()
    ├── Writes prescription → savePrescription()
    │
    └── Finishes → finishConsultation()
        ├── PUT update clinical notes
        └── PUT complete encounter (chained via switchMap)
```

---

## 7. Lab Module

> **Path**: `features/lab/` · **Route**: `/lab/**` · **Guard**: AuthGuard + PermissionGuard (`MOD_LAB`)

### Purpose
Laboratory workflow — request tests, collect samples, enter results, view reports.

### Components

| Component | Route | Permission | Purpose |
|-----------|-------|------------|---------|
| `LabRequestListComponent` | `/lab` | `MOD_LAB` | Queue of lab requests |
| `TestRequestComponent` | `/lab/request` | `MOD_LAB` | Create new test request |
| `LabTestEntryComponent` | `/lab/entry/:requestId` | `CMP_LAB_ENTRY` | Enter test results |
| `LabReportViewComponent` | `/lab/view/:requestId` | `CMP_LAB_READ` | View lab report |

### Facade: `LabFacade`

Extends `BaseFacade<LabRequest>` with:
- `labQueue`, `labTests`, `selectedRequest`, `saving`
- `pendingCount` — Computed count of ORDERED + SAMPLED requests
- `loadQueue()`, `loadLabTests()`, `loadRequestById()`, `createRequest()`, `updateStatus()`, `addResults()`

### Lab Workflow
```
ORDERED → SAMPLED → IN_PROGRESS → COMPLETED
                                      │
                                 Results available
```

---

## 8. IPD Module (Inpatient Department)

> **Path**: `features/ipd/` · **Route**: `/ipd/**` · **Guard**: AuthGuard + PermissionGuard (`MOD_PATIENTS`)

### Purpose
Inpatient care — bed management, patient admissions, ward rounds, and discharge.

### Components

| Component | Route | Purpose |
|-----------|-------|---------|
| `AdmissionListComponent` | `/ipd/admissions` | List of current admissions |
| `BedManagementComponent` | `/ipd/beds` | Visual bed map by ward |
| `AdmissionFormComponent` | `/ipd/admit` | Admit patient form |
| `DischargeSummaryComponent` | `/ipd/discharge/:admissionId` | Discharge documentation |
| `RoundFormComponent` | (child) | Doctor's daily rounds notes |

### Service: `IpdService`

Manages beds, admissions, wards, and rounds.

### Facade: `IpdFacade`

Extends `BaseFacade<Admission>` — the **most complex facade** with:

**Signals:**
- `beds`, `admissions` — Core data
- `showAvailable`, `showOccupied` — Filter toggles
- `patients`, `doctors`, `wards`, `availableBeds` — Form reference data
- `saving`

**Computed signals:**
- `bedAdmissionMap` — Map of bed ID → Admission
- `filteredWards` — Beds grouped by ward, filtered by availability toggles
- `availableCount`, `occupiedCount`, `occupancyRate` — Statistics
- `admissionList` — Admissions with flattened ward/bed info

**Key methods:**
| Method | Description |
|--------|-------------|
| `loadBedData()` | `forkJoin` beds + admissions |
| `loadAdmissions()` | Load admission list only |
| `loadAdmissionFormData()` | Load patients, doctors, wards for form dropdowns |
| `loadAvailableBeds(wardId)` | Filter beds by ward |
| `admitPatient(payload)` | Create new admission |
| `dischargePatient(id, payload)` | Discharge with summary |
| `addRound(payload)` | Record doctor's round notes |

---

## 9. Billing Module

> **Path**: `features/billing/` · **Route**: `/billing/**` · **Guard**: AuthGuard + PermissionGuard (`MOD_BILLING`)

### Purpose
Financial operations — invoice generation, payment processing, billing summaries.

### Components

| Component | Route | Permission | Purpose |
|-----------|-------|------------|---------|
| `BillingSummaryComponent` | `/billing` | `MOD_BILLING` | All invoices overview |
| `InvoiceGenerateComponent` | `/billing/invoice/new` | `CMP_INVOICE_GENERATE` | Create invoice |
| `PaymentReceiptComponent` | `/billing/receipt/:id` | `CMP_PAYMENT_RECEIPT` | View/print receipt |

### Services
- **`BillingService`** — Invoices, payments, summaries
- **`ChargeCatalogService`** — Hospital service charge catalog

### Facade: `BillingFacade`

Extends `BaseFacade<InvoiceResponse>` with:
- `invoices`, `selectedInvoice`, `billingSummary`, `saving`
- `totalRevenue` — Computed sum of all paid amounts
- `outstandingAmount` — Computed sum of all due amounts
- `loadInvoices()`, `loadInvoiceById()`, `loadSummary()`, `createInvoice()`, `processPayment()`

---

## 10. Admin Module

> **Path**: `features/admin/` · **Route**: `/admin/**` · **Guard**: AuthGuard + PermissionGuard (`MOD_ADMIN`)

### Purpose
System administration — manage users, departments, roles, and permissions.

### Components

| Component | Route | Permission | Purpose |
|-----------|-------|------------|---------|
| `UserListComponent` | `/admin/users` | `CMP_ADMIN_USER_READ` | User management table |
| `UserCreateComponent` | (dialog) | `CMP_ADMIN_USER_WRITE` | Create/edit user form |
| `DepartmentListComponent` | `/admin/departments` | `CMP_ADMIN_DEPT_READ` | Department list |
| `DepartmentCreateComponent` | (dialog) | `CMP_ADMIN_DEPT_WRITE` | Create/edit department |
| `RolePermissionComponent` | `/admin/roles` | `CMP_ADMIN_ROLE_WRITE` | Role-permission matrix |

### Service: `AdminService`

Manages departments, users, roles, and permissions CRUD.

### Facade: `AdminFacade`

Extends `BaseFacade<Department>` with:
- `departments`, `users`, `roles`, `permissions`, `saving`
- Department CRUD: `loadDepartments()`, `addDepartment()`, `updateDepartment()`, `deleteDepartment()`
- User CRUD: `loadUsers()`, `createUser()`, `updateUser()`
- Role management: `loadRoles()`, `loadPermissions()`, `updateRolePermissions()`

---

## 11. Error Module

> **Path**: `features/error/` · **Route**: `/error/**` · **No guard** (accessible by all)

### Purpose
Error display pages for HTTP error responses.

### Components

| Component | Route | Purpose |
|-----------|-------|---------|
| `NotFoundComponent` | `/error/not-found` | 404 page |
| `UnauthorizedComponent` | `/error/unauthorized` | 403 page |
| `ServerErrorComponent` | `/error/server-error` | 500 page |

These pages are navigated to by the `ErrorInterceptor` when corresponding HTTP errors occur. The wildcard route `**` also redirects to `/error/not-found`.

---

## 12. Voice Navigation Module

> **Path**: `features/voice-navigation/` · **Route**: `/voice` · **Guard**: AuthGuard + PermissionGuard (`MOD_VOICE`)

### Purpose
Voice-controlled navigation and input using the Web Speech API and Google GenAI.

### Components

| Component | Route | Purpose |
|-----------|-------|---------|
| `VoiceNavigationComponent` | `/voice` | Full voice navigation interface |

### Services
- **`VoiceRecognitionService`** — Wraps the Web Speech API for speech-to-text
- **`VoiceCommandService`** — Processes recognized speech into navigation commands using Fuse.js fuzzy matching and Google GenAI

### Related Shared Components
- `VoiceHudComponent` — Always-visible floating widget (in `app.component.html`)
- `VoiceInputDirective` — Attribute directive for voice-enabled form fields
