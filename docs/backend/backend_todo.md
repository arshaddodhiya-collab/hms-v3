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
- [ ] **Security Configuration**
    - [ ] Implement `SecurityConfig` (filter chain, password encoder).
    - [ ] Implement `JwtService` (token generation, validation).
    - [ ] Implement `JwtAuthenticationFilter`.
    - [ ] Configure CORS (allow frontend origin).
- [ ] **User & Role Entities**
    - [ ] Create `User`, `Role`, `Permission` entities.
    - [ ] Create `UserRepository`, `RoleRepository`.
    - [ ] Implement `UserDetailsService`.
- [ ] **Auth Endpoints**
    - [ ] Implement `AuthController` (`/api/v1/auth`).
    - [ ] `POST /login`: Generate JWT.
    - [ ] `GET /me`: Return current user context.

## 3. Master Data Modules (Core)
- [ ] **Department Module**
    - [ ] Create `Department` entity.
    - [ ] Create CRUD API (`/api/v1/departments`).
- [ ] **Patient Module**
    - [ ] Create `Patient` entity (BaseEntity, Audit fields).
    - [ ] Create `PatientRepository` (Search specifications).
    - [ ] Create `PatientService` & `PatientDto`.
    - [ ] Implement `PatientController` (`/api/v1/patients`).
        - [ ] `POST /`: Register patient.
        - [ ] `GET /`: List with pagination & search.
        - [ ] `GET /{id}`: Details.
        - [ ] `PUT /{id}`: Update.

## 4. Clinical Modules (OPD)
- [ ] **Appointment Module**
    - [ ] Create `Appointment` entity.
    - [ ] Implement `AppointmentController` (`/api/v1/appointments`).
        - [ ] `POST /`: Book.
        - [ ] `GET /`: List (filter by date/doctor).
        - [ ] `PATCH /{id}/status`: Update status.
- [ ] **Encounter Module (Consultation)**
    - [ ] Create `Encounter` entity (Link appointment, patient, doctor).
    - [ ] Create `Vitals` embeddable/entity or JSON column.
    - [ ] Implement `EncounterController` (`/api/v1/encounters`).
        - [ ] `POST /`: Start encounter.
        - [ ] `PATCH /{id}`: Save notes/diagnosis.
- [ ] **Prescription Module**
    - [ ] Create `Prescription` & `PrescriptionItem` entities.
    - [ ] Implement API to add prescriptions to an encounter.

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
