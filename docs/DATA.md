do not build at once we will go step by step with modules and other codes

You are a senior Angular architect.

Build a SMALL but REALISTIC Hospital Management System (HMS) FRONTEND
based strictly on FEATURE-BASED MODULE ARCHITECTURE.

IMPORTANT CONSTRAINTS (DO NOT VIOLATE):

- Angular version: Angular 17
- Use OLD STYLE NgModules (AppModule, FeatureModule, RoutingModule)
- DO NOT use standalone components
- DO NOT create role-wise modules
- Frontend only (no backend code)
- Focus on module & component consistency, not UI polish

ROLES IN THE SYSTEM:

- Hospital
- Admin
- Doctor
- Nurse
- Lab Technician
- Front Desk

CRITICAL DESIGN RULE:
Roles DO NOT own modules.
Roles only control ACCESS (menus, routes, buttons) using permissions.

---

## FEATURE MODULES TO CREATE (FINAL LIST)

1. AuthModule
   Components:
   - LoginComponent

2. DashboardModule
   Components:
   - DashboardComponent
   - StatsCardsComponent
   - TodayActivityComponent

3. PatientsModule
   Components:
   - PatientListComponent
   - PatientRegisterComponent
   - PatientViewComponent
   - PatientEditComponent

4. AppointmentsModule
   Components:
   - AppointmentListComponent
   - AppointmentCreateComponent
   - AppointmentViewComponent

5. TriageModule
   Components:
   - VitalsEntryComponent
   - VitalsViewComponent

6. ConsultationModule
   Components:
   - ConsultationListComponent
   - ConsultationDetailComponent
   - DiagnosisNotesComponent
   - PrescriptionComponent

7. LabModule
   Components:
   - LabRequestListComponent
   - LabTestEntryComponent
   - LabReportViewComponent

8. BillingModule
   Components:
   - BillingSummaryComponent
   - InvoiceGenerateComponent
   - PaymentReceiptComponent

9. AdminSetupModule
   Components:
   - DepartmentListComponent
   - DepartmentCreateComponent
   - UserListComponent
   - UserCreateComponent
   - RolePermissionComponent

10. SharedModule
    Components:
    - PageHeaderComponent
    - ConfirmDialogComponent
    - TableComponent
    - StatusBadgeComponent

---

## ROUTING REQUIREMENTS

- Each feature module MUST have:
  - <feature>.module.ts
  - <feature>-routing.module.ts
- Use RouterModule.forChild()
- AppRoutingModule should lazy-load feature modules
- Use route `data` for permission codes (mocked)

---

## PERMISSION-BASED ACCESS (FRONTEND MOCK)

- Create a permissions.constants.ts file
- Use string-based permission codes (MOD*\*, CMP*\*)
- Example:
  MOD_PATIENTS
  CMP_PATIENT_ADD

- Create a menu.config.ts
- Sidebar menu must be filtered based on permissions
- Use a mock AuthService returning permissions

---

## GUARDS

- AuthGuard (mocked)
- PermissionGuard (checks route data permission)

---

## DELIVERABLES EXPECTED

1. Clean Angular folder structure
2. All feature modules + routing modules
3. Dummy components with minimal templates
4. Centralized permission constants
5. Menu configuration
6. Guards wired to routes
7. NO duplicated dashboards
8. NO role-based modules

---

## IMPORTANT NOTES

- Do NOT implement backend APIs
- Do NOT implement UI themes
- Do NOT over-engineer
- Consistency and correctness > features
- This is an architecture-learning project

Build this as if it will be reviewed by a senior Angular mentor.
