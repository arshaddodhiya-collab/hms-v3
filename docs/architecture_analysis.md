
# HMIS Frontend → Backend Architectural Analysis

Date: 2026-02-03

This document captures a deep, end-to-end architectural analysis of the Angular frontend and the existing database plan. It validates completeness, scalability, security, and readiness for a Spring Boot + MySQL backend.

---

**Executive summary**

- The frontend implements client-side RBAC using flat permission strings and route guards; the backend must provide authoritative RBAC, tenant scoping, token rotation, attachment storage, audit trails, and background jobs. The provided `database_implementation_plan.md` is a strong baseline but requires additions for sessions, multi-organization scoping, attachments, search, and operational tables.

---

## 1) Full frontend analysis

- Project surface
  - Feature modules found: `auth`, `dashboard`, `patients`, `appointments`, `triage` (+ `vitals-shared.module.ts`), `consultation`, `lab`, `billing`, `admin`, `error`.
  - Shared UI: base CRUD components, table, confirm-dialog, page-header, status-badge.
  - Core: services, guards, interceptors, constants, menu config.
  - No global state library (NgRx/NGXS). Services use `BehaviorSubject` for state (e.g., `MockAuthService.currentUser$`).

- Routing & access patterns
  - App routing uses lazy-loaded feature modules with `AuthGuard` and `PermissionGuard`. Route-level permissions are read from `route.data.permission`.
  - Menu visibility is driven by `MENU_CONFIG` using same permission strings.

- Services & API
  - `ApiService` is a single HTTP wrapper assuming JSON REST endpoints. `AuthInterceptor` reads a token from `localStorage` and sets `Authorization: Bearer` header.
  - `MockAuthService` stores mock user objects including a `permissions: string[]` array persisted in localStorage.

- Implied business entities and flows
  - Users, Roles, Permissions, Departments
  - Patients (MRN), Appointments, Encounters/Consultations, Vitals, Prescriptions
  - Lab: test catalog, lab requests, normalized lab results
  - Billing: invoices, payments, invoice items

- Hidden/indirect requirements identified
  - Persistent sessions, refresh tokens, login history and account lockout
  - Attachment/document storage (lab reports, scanned consent forms)
  - Search and list endpoints with pagination and filters
  - Bulk import/export and background job support
  - Per-organization scoping (not present in frontend but required for multi-hospital deployments)

- Frontend assumptions requiring backend support
  - Permission strings are authoritative — backend must expose and enforce them.
  - Route guarding is insufficient without server-side checks on APIs.
  - Short-lived JWT + refresh token flow expected by `AuthInterceptor`.

---

## 2) Permission & Authorization analysis (critical)

- What exists today (from `src/app/core`)
  - A flat `PERMISSIONS` list (module-level `MOD_*`, action aliases `ACT_*`, component-level `CMP_*`).
  - `MockAuthService.hasPermission(permission)` returns `user.permissions.includes(permission)`.
  - `PermissionGuard` blocks routes where required permission missing.

- Granularity and enforcement
  - Granularity: module-level and component/action-level. No field-level enforcement in the frontend.
  - Enforcement: currently purely client-side. Critical to implement server-side enforcement.

- Recommended production-grade authorization model
  - Core entities: `user`, `organization` (hospital/tenant), `role`, `permission`, `user_role`, `role_permission`, `refresh_token`.
  - Start with RBAC stored in DB and add ABAC later for resource-scoped policies.
  - Compute effective permission set per user by merging role permissions + direct grants at login.

- Required DB tables (summary)
  - `organization` — hospital tenant metadata.
  - `user` — with `organization_id`, `username`, `password` (bcrypt), `last_login`, `is_locked`.
  - `role`, `permission` — `name` unique, `module` grouping, `description`.
  - `user_role`, `role_permission` — composite PK join tables.
  - `refresh_token` — opaque tokens hashed, `revoked` flag, device/ip metadata.

- Indexing & constraints
  - Unique constraints on `permission.name`, `role.name`, `user.username`, `user.email`.
  - Composite PKs for join tables and indexes on `user_id`, `role_id`, `organization_id`.

- Permission caching strategy
  - Cache computed permission lists in Redis keyed by `user_permissions:{user_id}` with TTL (5–15 minutes).
  - Invalidate cache on `role_permission`, `user_role`, or `permission` changes via event publish or DB trigger + application invalidation.
  - Keep JWTs short-lived and include `user_id`, `organization_id`, and a `permissions_version` claim.

- Mapping frontend permission config to backend
  - Seed the `permission` table from the frontend `PERMISSIONS` constants.
  - Provide management endpoints: `/permissions`, `/roles`, `/roles/{id}/permissions`, `/users/{id}/roles`.

---

## 3) Database gap analysis (compare `database_implementation_plan.md` vs frontend needs)

- Plan strengths (already present)
  - Normalized clinical tables (`vitals`, `prescription`, `lab_result`), RBAC base model (`user`, `role`, `permission`, join tables), `audit_log` and `invoice` with JSON items.

- Missing tables/columns/concerns (must add)
  - `organization` table and `organization_id` FK on master/transactional tables.
  - `refresh_token`, `password_reset_token`, `email_verification_token`.
  - `patient_identifier` or `mrn` column (unique per organization).
  - `attachment` table for files with `entity_type`/`entity_id`, storage_path/url, checksum.
  - `job` or `background_task` table for imports, report generation, and worker coordination.
  - `notification` table for in-app notifications.
  - Search support: full-text indexing or external search (Elastic) for patient names and clinical notes.
  - `deleted_at` and `deleted_by` in addition to `is_deleted` to allow recoveries and audits.

- Column-level improvements
  - Add `last_login`, `failed_login_attempts`, `is_locked`, `lock_until` to `user`.
  - Add `organization_id` to `patient`, `appointment`, `encounter`, `lab_request`, `invoice`.
  - Ensure audit fields (`created_by`, `updated_by`, `created_at`, `updated_at`) exist everywhere.

- Soft delete & retention
  - Use `is_deleted` + `deleted_at` + `deleted_by`. Implement application-level unique constraints when needed.

---

## 4) Backend readiness & API design (REST contracts)

- Authentication
  - POST `/auth/login` → returns `{ accessToken (JWT), refreshToken, expiresIn, user }`.
  - POST `/auth/refresh` → rotates refresh token, returns new access token.
  - POST `/auth/logout` → revoke refresh token.

- RBAC management
  - GET `/permissions`
  - GET/POST/PUT `/roles`
  - PUT `/roles/{id}/permissions`
  - POST `/users/{id}/roles`
  - GET `/users/{id}/permissions` (effective)

- Core resource patterns (examples)
  - Patients: `GET /patients`, `GET /patients/{id}`, `POST /patients`, `PUT /patients/{id}`, `DELETE /patients/{id}` with pagination, `q`, filters, `organization_id` scoping.
  - Appointments: `GET /appointments`, `POST /appointments`, `PATCH /appointments/{id}/status`, bulk endpoints for imports.
  - Encounters/Vitals: `POST /encounters`, `POST /vitals`, `GET /encounters/{id}/vitals`.
  - Lab: `GET /lab/requests`, `POST /lab/requests`, `POST /lab/requests/{id}/results` (bulk), `GET /lab/requests/{id}/report`.
  - Billing: `POST /invoices`, `GET /invoices`, `POST /invoices/{id}/payments`.

- DTO & paging
  - Use consistent DTO shape with `id`, `uuid`, `created_at`, `created_by`, `organization_id`.
  - Pagination: offset-based `page`/`size`; consider cursor-based for time-ordered streams.
  - Filtering: query params and standardized `filter` JSON for complex queries.

- Async and background processing
  - Long-running imports, batch lab processing, heavy report generation should use queue (RabbitMQ/Kafka/Redis streams) and worker pool (Spring Batch or dedicated workers).

---

## 5) Future scalability & security (recommendations)

- Database versioning
  - Use Flyway for migrations and seed data (permissions, roles). Keep migrations in VCS.

- RBAC vs ABAC
  - Implement RBAC first; add ABAC for rules that require resource-level checks (e.g., clinicians can only view patients in same organization or assigned to them).

- Token strategy
  - Short-lived JWT access tokens (5–15 minutes) + opaque refresh tokens persisted hashed in DB and rotated.
  - For larger ecosystems, evaluate Keycloak or Spring Authorization Server.

- Data isolation
  - `organization_id` column and strict application-layer filtering. For higher isolation, consider schema-per-tenant.

- Performance
  - Indexes for patient and appointment queries; partition `lab_result` by date or request_id at scale.
  - Move attachments to object-storage and serve via signed URLs + CDN.

- Reporting & analytics
  - Implement CDC or ETL into a data warehouse. Aggregate and precompute common KPIs.

- Security hardening
  - Encrypt PII when required, log security-sensitive actions in `audit_log`, implement rate-limiting, and enforce least privilege on DB access.

---

## 6) DB schema suggestions (tables summary)

Below are the high-priority tables to add or confirm:

- `organization` (id, uuid, name, code, timezone, config JSON, created_at)
- `user` (id, uuid, username, password_hash, full_name, email, phone, organization_id, is_active, last_login, failed_login_attempts, is_locked, created_at, updated_at)
- `role` (id, name, description, organization_scoped BOOLEAN)
- `permission` (id, name, module, description)
- `user_role` (user_id, role_id, assigned_by, assigned_at) — PK (user_id, role_id)
- `role_permission` (role_id, permission_id, assigned_by, assigned_at) — PK (role_id, permission_id)
- `refresh_token` (id, user_id, token_hash, expires_at, revoked, issued_at, ip_address, device_info)
- `patient` (id, uuid, mrn, organization_id, first_name, last_name, dob, gender, contact, address, is_deleted, created_by, created_at, updated_at)
- `attachment` (id, uuid, organization_id, entity_type, entity_id, filename, content_type, size, storage_path, checksum, uploaded_by, uploaded_at)
- `job` (id, type, payload JSON, status, attempts, last_error, created_at, updated_at)

Add indices and FK constraints as described in the main analysis.

---

## 7) Actionable recommendations (priority-ordered)

1. Seed the `permission` table using the frontend `PERMISSIONS` constants and create admin UIs to manage roles.
2. Add `organization` and propagate `organization_id` to top-level tables (users, patients, appointments, lab_requests, invoices).
3. Implement refresh token table and rotation/revocation logic.
4. Implement server-side permission checks (middleware/interceptor) and cache effective permissions in Redis.
5. Add `attachment` table + object-storage (S3/GCS) + signed-URL flow.
6. Add background job queue + `job` table for imports and reports.
7. Use Flyway and include migrations that seed roles/permissions.
8. Add full-text search or integrate ElasticSearch for patient and notes search.

---

## 8) Final checklist — Things you were missing

- `refresh_token` table and token rotation/revoke flows
- `organization` + organization scoping on core tables
- `attachment` table and signed URL strategy
- `patient_identifier`/`mrn` per-organization uniqueness
- `failed_login_attempts`, `is_locked`, `last_login`
- Permission persistence & management endpoints
- Redis permission cache and invalidation mechanism
- `job` table and background worker pattern
- Search strategy for large text fields

---

## Next steps (pick one)

- I can generate Flyway SQL migrations that create the RBAC + `organization` + `refresh_token` + `attachment` tables and seed `permission` values.
- Or I can scaffold Spring Boot entities/controllers for `auth`, `users`, `roles`, `permissions`, and `patients` (with pagination) matching the frontend `ApiService` patterns.

Please tell me which you'd like me to create next.
