# Frontend Integration Todo List (Angular + Spring Boot)

This checklist tracks the tasks required to connect the Angular frontend with the Spring Boot backend.

## 1. Environment & Configuration
- [ ] **Configure API Base URL**
    - [ ] Update `src/environments/environment.ts` with `apiUrl: 'http://localhost:8080/api/v1'`.
    - [ ] Update `src/environments/environment.prod.ts` with production API URL.
- [ ] **HTTP Interceptor**
    - [ ] Create `AuthInterceptor` to inject JWT token into `Authorization` header.
    - [ ] Create `ErrorInterceptor` to handle global API errors (401, 403, 500) and show notifications.
- [ ] **CORS Check**
    - [ ] Ensure backend allows requests from frontend origin (e.g., `http://localhost:4200`).

## 2. Authentication Integration
- [ ] **Update AuthService**
    - [ ] Replace mock login with `POST /api/v1/auth/login`.
    - [ ] Store JWT/RefreshToken in LocalStorage/SessionStorage.
    - [ ] Implement `logout()` to clear tokens.
    - [ ] Implement `isAuthenticated()` check based on token validity.
- [ ] **User Context**
    - [ ] Fetch current user details on app init (`GET /api/v1/auth/me`).
    - [ ] Store user permissions in a simplified state/store for guard checks.

## 3. Core Module Integration (Services & Models)
- [ ] **Patient Service Integration**
    - [ ] Update `PatientService` methods:
        - [ ] `getPatients(page, size, search)` -> `GET /api/v1/patients`.
        - [ ] `getPatient(id)` -> `GET /api/v1/patients/{id}`.
        - [ ] `createPatient(data)` -> `POST /api/v1/patients`.
        - [ ] `updatePatient(id, data)` -> `PUT /api/v1/patients/{id}`.
    - [ ] Update `Patient` interface to match backend DTO fields.
- [ ] **Appointment Service Integration**
    - [ ] Update `AppointmentService`:
        - [ ] `getAppointments(dateData)` -> `GET /api/v1/appointments`.
        - [ ] `createAppointment(data)` -> `POST /api/v1/appointments`.
        - [ ] `updateStatus(id, status)` -> `PATCH /api/v1/appointments/{id}/status`.

## 4. Clinical Module Integration
- [ ] **Encounter & Vitals**
    - [ ] Create `EncounterService`.
    - [ ] Connect `TriageComponent` to `POST /encounters/{id}/vitals` (or `PATCH`).
    - [ ] Connect `ConsultationComponent` to fetch/save encounter details.
- [ ] **Prescription Integration**
    - [ ] Update `PrescriptionService` to save prescriptions to backend.

## 5. Lab & Diagnostic Integration
- [ ] **Lab Service**
    - [ ] Fetch catalog from `GET /api/v1/labs/tests`.
    - [ ] Submit requests via `POST /api/v1/lab-requests`.
    - [ ] Connect `LabDashboard` to `GET /api/v1/lab-requests` (Queue).

## 6. Billing Module Integration
- [ ] **Billing Service**
    - [ ] Fetch invoices from `GET /api/v1/billing/invoices`.
    - [ ] Generate invoice via `POST /api/v1/billing/invoices`.

## 7. UI/UX Refinements
- [ ] **Loading States**
    - [ ] Add loading spinners/skeletons while waiting for API responses in all lists.
- [ ] **Error Handling**
    - [ ] Display toast notifications for success/error messages from API.
- [ ] **Validation Sync**
    - [ ] Ensure frontend form validation patterns match backend `@Valid` constraints.
