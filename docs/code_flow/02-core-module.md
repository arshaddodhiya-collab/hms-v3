# 02 — Core Module

> **Path**: `src/app/core/`
> **Import**: `CoreModule` — imported ONLY in `AppModule` (singleton guard prevents re-import)

The Core module provides all singleton infrastructure services, interceptors, guards, and configuration that the entire application depends on. It follows the Angular best practice of centralizing cross-cutting concerns.

---

## Module Registration (`core.module.ts`)

```typescript
@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    MessageService,           // PrimeNG global toast service
    ApiService,               // Centralized HTTP client
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class CoreModule {
  // Singleton guard — throws error if imported twice
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
```

---

## Services

### `ApiService` (`services/api.service.ts`)

Central HTTP wrapper used by ALL feature services. Every API call in the application flows through this service.

| Method | Signature | Purpose |
|--------|-----------|---------|
| `get<T>` | `get<T>(path, params?): Observable<T>` | HTTP GET |
| `getBlob` | `getBlob(path, params?): Observable<Blob>` | Download files |
| `post<T>` | `post<T>(path, body, params?): Observable<T>` | HTTP POST |
| `put<T>` | `put<T>(path, body, params?): Observable<T>` | HTTP PUT |
| `patch<T>` | `patch<T>(path, body, params?): Observable<T>` | HTTP PATCH |
| `delete<T>` | `delete<T>(path, params?): Observable<T>` | HTTP DELETE |

**Key behaviors:**
- Base URL: `http://localhost:8080/api/v1` (from `environment.ts`)
- Automatically prepends base URL unless path starts with `http`
- Sets `Content-Type: application/json` and `Accept: application/json` headers
- Body is serialized with `JSON.stringify()`

**Flow:**
```
Feature Service → ApiService.get('/patients') → HttpClient.get('http://localhost:8080/api/v1/patients')
                                                    ↓
                                         AuthInterceptor (adds cookies)
                                                    ↓
                                         ErrorInterceptor (handles errors)
                                                    ↓
                                              Backend API
```

---

### `UserService` (`services/user.service.ts`)

Minimal service for fetching user data (specifically doctors for dropdowns).

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `getDoctors()` | `GET /users/doctors` | Fetch list of doctors |

Used by `IpdFacade` when loading admission form data.

---

### `ErrorStateService` (`services/error-state.service.ts`)

Simple state holder for error details, used to pass error context to error pages.

```typescript
interface ErrorDetails {
  message: string;
  status: number;
  timestamp: Date;
  url?: string;
  stackTrace?: string;
}
```

| Method | Purpose |
|--------|---------|
| `setError(details)` | Store error details |
| `getError()` | Retrieve current error |
| `clearError()` | Clear stored error |

---

## Interceptors

### `AuthInterceptor` (`interceptors/auth.interceptor.ts`)

**Purpose**: Enable cookie-based authentication for API requests.

**Flow:**
```
Outgoing Request
    │
    ├── URL contains '/api/'?
    │   ├── YES → Clone request with `withCredentials: true`
    │   └── NO → Pass through unchanged
    │
    └── Response Error?
        ├── 401 AND not login request → Redirect to /auth/login
        └── Other → Re-throw error
```

**Why `withCredentials: true`?**
The backend uses HTTP-only session cookies. This flag tells the browser to include cookies in cross-origin requests.

---

### `ErrorInterceptor` (`interceptors/error.interceptor.ts`)

**Purpose**: Global error handling for all HTTP responses.

**Flow:**
```
HTTP Response Error
    │
    ├── URL contains '/auth/me'? → Skip (silent fail for session check)
    │
    ├── Client-side error (ErrorEvent)?
    │   └── Show toast: "Client Error"
    │
    └── Server-side error?
        ├── 401 → (Handled by AuthInterceptor)
        ├── 403 → Redirect to /error/unauthorized
        ├── 404 → Redirect to /error/not-found
        ├── 500 → Show toast: "Server Error" (no redirect to preserve state)
        └── Other → Show toast with error message
```

**Key design decision**: 500 errors show a toast instead of redirecting. This prevents losing user's work when a background API call fails.

---

## Guards

### `AuthGuard` (`guards/guards.ts`)

**Purpose**: Protect routes that require authentication.

```
Can user access route?
    │
    ├── authService.isAuthenticated()? → ✅ Allow access
    └── Not authenticated? → ❌ Redirect to /auth/login
```

`isAuthenticated()` checks if `currentUserSubject.value` is not null (i.e., user data exists in memory from `/auth/me` call).

### `PermissionGuard` (`guards/guards.ts`)

**Purpose**: Protect routes that require specific permissions.

```
Can user access route?
    │
    ├── No permission required in route data? → ✅ Allow
    │
    ├── authService.hasPermission(requiredPermission)?
    │   ├── YES → ✅ Allow access
    │   └── NO → ❌ Show error toast, deny access
```

**Usage in routes:**
```typescript
{
  path: 'patients',
  loadChildren: () => import('./features/patients/patients.module'),
  canActivate: [AuthGuard, PermissionGuard],
  data: { permission: 'MOD_PATIENTS' },
}
```

---

## Configuration

### `menu.config.ts` (`config/menu.config.ts`)

Defines the sidebar navigation tree. Each menu item has:
- `label` — Display text
- `icon` — PrimeIcons icon name
- `route` — Router link (optional, absent for parent groups)
- `permission` — Required permission string
- `items` — Sub-menu items (creates collapsible groups)

**Menu structure:**
```
Dashboard ── /dashboard (MOD_DASHBOARD)
OPD ──┬── Patients ── /patients (MOD_PATIENTS)
      ├── Appointments ── /appointments (MOD_APPOINTMENTS)
      ├── Triage ── /triage (MOD_TRIAGE)
      └── Consultation ── /consultation (MOD_CONSULTATION)
IPD ──┬── Admissions ── /ipd/admissions (MOD_PATIENTS)
      └── Bed Management ── /ipd/beds (MOD_PATIENTS)
Diagnostics ── Lab ── /lab (MOD_LAB)
Billing ── /billing (MOD_BILLING)
Administration ──┬── Users ── /admin/users (CMP_ADMIN_USER_READ)
                 ├── Departments ── /admin/departments (CMP_ADMIN_DEPT_READ)
                 └── Roles ── /admin/roles (CMP_ADMIN_ROLE_WRITE)
Voice Navigation ── /voice (MOD_VOICE)
```

---

### `mock-users.config.ts` (`config/mock-users.config.ts`)

Pre-configured user profiles for development/testing. Each mock user defines:
- `username` / `password` — Login credentials (all passwords are `'123'`)
- `role` — Display role name
- `permissions` — Array of permission strings the user has

**5 roles configured**: Administrator, Doctor, Nurse, Lab Technician, Front Desk

---

### `permissions.constants.ts` (`constants/permissions.constants.ts`)

Centralized permission string constants organized in three tiers:

| Tier | Prefix | Example | Purpose |
|------|--------|---------|---------|
| Module | `MOD_` | `MOD_PATIENTS` | Access to entire feature module |
| Component | `CMP_` | `CMP_PATIENT_ADD` | Access to specific UI components |
| Action | `ACT_` | `ACT_DELETE` | Generic CRUD action permissions |

---

## BaseFacade (`facades/base-facade.ts`)

Abstract base class that all feature facades extend. Provides common Signal-based state:

```typescript
abstract class BaseFacade<T> {
  // Core state
  readonly data = signal<T[]>([]);
  readonly selectedItem = signal<T | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Computed
  readonly hasData = computed(() => this.data().length > 0);
  readonly isEmpty = computed(() => !this.loading() && this.data().length === 0);
  readonly count = computed(() => this.data().length);

  // Abstract — must be implemented
  abstract load(): void;

  // Shared methods
  select(item: T | null): void { this.selectedItem.set(item); }
  clearError(): void { this.error.set(null); }
}
```

This ensures every feature module has consistent loading, error, and data state management out of the box.

---

## Core Models

The `models/` directory contains all TypeScript interfaces shared across features:

| File | Key Interfaces |
|------|---------------|
| `patient.model.ts` | `Patient`, `MedicalHistory`, `Visit`, `Bed`, `Admission`, `AppointmentStatus`, `EncounterStatus`, `AdmissionStatus` |
| `encounter.model.ts` | `EncounterResponse`, `EncounterCreateRequest`, `EncounterUpdateRequest`, `RoundResponse` |
| `vitals.model.ts` | `VitalsRequest`, `VitalsResponse` |
| `prescription.model.ts` | `PrescriptionItem`, `PrescriptionRequest`, `PrescriptionResponse` |
| `lab.models.ts` | `LabRequest`, `LabTest`, `CreateLabRequest`, `LabRequestStatus`, `AddLabResultRequest` |
| `page.model.ts` | `Page<T>` (paginated response wrapper) |
| `department.model.ts` | `Department` |
| `user.model.ts` | `User` |
| `menu.model.ts` | `MenuItem` |

See [07-models-and-interfaces.md](./07-models-and-interfaces.md) for detailed interface definitions.
