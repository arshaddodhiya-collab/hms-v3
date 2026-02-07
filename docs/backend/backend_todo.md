# Backend Implementation Todo List (Spring Boot + MySQL)

This checklist tracks the development of the HMS backend, based on `docs/BACKEND_IMPL_PLAN.md`.

## 1. Project Initialization & Configuration
- [ ] **Initialize Spring Boot Project**
    - [ ] Create project using Spring Initializr (Java 17+, Spring Boot 3.2+).
    - [ ] Dependencies: Web, JPA, MySQL Driver, Validation, Security, Lombok, Flyway, MapStruct, DevTools.
    - [ ] Set up git repository and `.gitignore`.
- [ ] **Database Configuration**
    - [ ] Create MySQL database `hms_db`.
    - [ ] Configure `application.yml` (datasource, JPA settings, Flyway).
    - [ ] Configure `application-dev.yml` and `application-prod.yml`.
- [ ] **Folder Structure Setup**
    - [ ] Create packages: `config`, `controller`, `dto`, `entity`, `exception`, `mapper`, `repository`, `security`, `service`, `util`.

## 2. Authentication & Security Module
- [ ] **Security Architecture & Config**
    - [ ] Implement `SecurityConfig` (SecurityFilterChain).
        - [ ] Disable CSRF (Stateless architecture).
        - [ ] Configure `SessionCreationPolicy.STATELESS`.
        - [ ] Configure `CorsConfigurationSource` (Allow frontend origin).
        - [ ] Enable `@EnableMethodSecurity` (for `@PreAuthorize`).
    - [ ] Implement `JwtAuthenticationEntryPoint` (Custom 401 response).
    - [ ] Implement `CustomAccessDeniedHandler` (Custom 403 response).
- [ ] **Domain Entities & Persistence**
    - [ ] Create `User` Entity (Audit fields, Soft delete).
    - [ ] Create `Role` and `Permission` Entities (Many-to-Many).
    - [ ] **[NEW]** Create `RefreshToken` Entity (For secure session management).
        - [ ] Fields: `id`, `token` (hash), `user_id`, `expiryDate`, `revoked`.
    - [ ] Create Repositories: `UserRepository`, `RoleRepository`, `PermissionRepository`, `RefreshTokenRepository`.
- [ ] **JWT Core Service**
    - [ ] Implement `JwtService`:
        - [ ] `generateAccessToken(userDetails)` (Short expiry: ~15-30m).
        - [ ] `generateRefreshToken(user)` (Long expiry: ~7d).
        - [ ] `isActive(token)`: Validate signature and claims.
    - [ ] Implement `JwtAuthenticationFilter`:
        - [ ] Extract Header -> Validate -> Load UserDetails -> Set SecurityContext.
- [ ] **Auth Business Logic (`AuthService`)**
    - [ ] `register(request)`: Validate, Password Hash (BCrypt), Assign Default Role.
    - [ ] `login(request)`: AuthManager auth, Generate Tokens, Save Refresh Token.
    - [ ] `refreshToken(request)`: Verify persistence, Rotate tokens (Reuse detection?).
    - [ ] **Data Seeder (`DataInitializer`)**:
        - [ ] Sync Roles/Permissions from `permissions.constants.ts` on startup.
        - [ ] Create default Admin/Doctor users if empty.
- [ ] **Auth Endpoints (`AuthController`)**
    - [ ] `POST /api/v1/auth/login`: Returns `{ access_token, refresh_token, user_context }`.
    - [ ] `POST /api/v1/auth/refresh-token`: Returns `{ access_token, refresh_token }`.
    - [ ] `GET /api/v1/auth/me`: Current user details + Permissions list.
    - [ ] `POST /api/v1/auth/logout`: Revoke/Delete refresh token.

## 3. Master Data Modules (Core)
- [ ] **Shared Domain Kernel**
    - [ ] Create `BaseEntity` (`@MappedSuperclass`) with:
        - [ ] Primary Key (`id`: Long/Identity).
        - [ ] Audit Fields (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`).
        - [ ] Soft Delete Field (`isDeleted`).
    - [ ] Create `PublicEntity` extension (adds `uuid` for external/frontend reference).
    - [ ] Configure JPA Auditing (`@EnableJpaAuditing` with `AuditorAware` impl).
- [ ] **Department Module (Aggregate)**
    - [ ] Create `Department` Entity (extends `PublicEntity`).
        - [ ] Fields: `name` (Unique), `description`, `headOfDepartment` (One-to-One User).
    - [ ] Implement `DepartmentService`:
        - [ ] Logic to prevent deleting departments with active staff/patients.
    - [ ] Implement `DepartmentController` (`/api/v1/departments`).
        - [ ] Secure with `PreAuthorize("hasAuthority('CMP_ADMIN_DEPT_READ')")`.
- [ ] **Patient Module (Aggregate)**
    - [ ] Create `Patient` Entity (extends `PublicEntity`).
        - [ ] Fields: `firstName`, `lastName`, `dob`, `gender` (Enum), `contact`, `email`, `address`.
        - [ ] Indexes: `idx_patient_name`, `idx_patient_contact`.
    - [ ] Implement `PatientRepository` with `JpaSpecificationExecutor`.
        - [ ] Build `PatientSearchSpecification` (filter by name partial, phone, email).
    - [ ] Implement `PatientService`:
        - [ ] `register()`: Check duplicate (Name + DOB + Contact).
        - [ ] `calculateAge()`: Transient getter or DTO mapper logic.
        - [ ] `update()`: Handle concurrency (Optimistic Locking `@Version`).
    - [ ] Implement `PatientController` (`/api/v1/patients`) with MapStruct DTOs.

## 4. Clinical Modules (OPD)
- [ ] **Appointment Module (Scheduling)**
    - [ ] Create `Appointment` Entity (`@Entity`).
        - [ ] Fields: `startDateTime`, `endDateTime`, `reason`, `cancelReason`.
        - [ ] Status Enum: `SCHEDULED`, `CHECKED_IN` (Arrived), `IN_PROGRESS` (With Doctor), `COMPLETED`, `CANCELLED`, `NO_SHOW`.
    - [ ] Implement `AppointmentRepository`:
        - [ ] `findOverlappingAppointments(doctor, start, end)` (Validation).
        - [ ] `findByDoctorAndDateRange()` (Doctor Dashboard).
    - [ ] Implement `AppointmentService` (State Machine Logic):
        - [ ] `book()`: Validate slot availability.
        - [ ] `cancel()`: Require reason, audit log.
        - [ ] `checkIn()`: Move to `CHECKED_IN`, trigger Triage Queue.
- [ ] **Encounter Module (The Visit)**
    - [ ] Create `Encounter` Entity.
        - [ ] One-to-One with `Appointment`.
        - [ ] Status Enum: `TRIAGE` (Nurse), `IN_PROGRESS` (Doctor), `COMPLETED` (Signed).
    - [ ] **Vitals Sub-module (Triage)**
        - [ ] Create `Vitals` Entity (One-to-One with Encounter).
        - [ ] API: `POST /encounters/{id}/vitals` (Creates Encounter if not exists in `TRIAGE` state).
    - [ ] **Consultation Sub-module**
        - [ ] Update `Encounter` with `chiefComplaint`, `diagnosis`, `notes` (Doctor only).
        - [ ] API: `PATCH /encounters/{id}/clinical-notes`.
- [ ] **Prescription Module**
    - [ ] Create `Prescription` (Header) and `PrescriptionItem` (Detail) Entities.
        - [ ] Header: `note`, `status` (DRAFT, ISSUED).
        - [ ] Item: `medicineName`, `dosage`, `frequency`, `duration`, `instructions`.
    - [ ] Implement `PrescriptionService`:
        - [ ] `maintainPrescription(encounterId, items)`: Overwrite/Update logic (Draft mode).
        - [ ] `issuePrescription()`: Lock for editing, generate PDF/Print data.
- [ ] **OPD Facade Controller** (`OpdController` or split)
    - [ ] `POST /api/v1/opd/check-in/{apptId}` (Reception).
    - [ ] `GET /api/v1/opd/queue/triage` (Nurse Dashboard).
    - [ ] `GET /api/v1/opd/queue/doctor` (Doctor Dashboard).

## 5. Diagnostic Module (Labs)
- [ ] **Lab Test Catalog**
    - [ ] Create `LabTest` entity (Catalog).
    - [ ] Seed default tests.
- [ ] **Lab Requests**
    - [ ] Create `LabRequest` & `LabResult` entities.
    - [ ] Implement `LabController` (`/api/v1/lab-requests`).
        - [ ] `GET /`: Queue for technicians.
        - [ ] `POST /{id}/results`: Enter results.

## 6. Inpatient Module (IPD)
- [ ] **Ward & Bed Management**
    - [ ] Create `Ward`, `Bed` entities.
    - [ ] API to list wards and bed status (`/api/v1/ipd/beds`).
- [ ] **Admission Lifecycle**
    - [ ] Create `Admission` entity.
    - [ ] Implement `AdmissionController` (`/api/v1/ipd`).
        - [ ] `POST /admit`: Admit patient (occupy bed).
        - [ ] `POST /{id}/discharge`: Discharge (free bed, summary).

## 7. Financial Module (Billing)
- [ ] **Invoice Generation**
    - [ ] Create `Invoice` entity (`items` as JSON).
    - [ ] Implement `BillingController` (`/api/v1/billing`).
        - [ ] `POST /invoices`: Generate from Admission/Encounter.
        - [ ] `GET /invoices`: List by patient/status.

## 8. Cross-Cutting Concerns
- [ ] **Global Exception Handling**
    - [ ] `@ControllerAdvice` for `ResourceNotFound`, `ValidationException`.
- [ ] **Audit Logging**
    - [ ] Implement `AuditLog` entity.
    - [ ] Create Aspect/Listener to log critical actions.
- [ ] **API Documentation**
    - [ ] Enable Swagger/OpenAPI (`/swagger-ui.html`).

## 9. Testing & Deployment
- [ ] **Unit Tests**: Services & Util classes (JUnit 5, Mockito).
- [ ] **Integration Tests**: Controllers (MockMvc).
- [ ] **Dockerization**: Create `Dockerfile` & `docker-compose.yml`.
