# Authentication & Access Control Flow

This document explains how the Auth module and Role-Based Access Control (RBAC) work in the HMS.

## 1. The Login Flow
1.  **User Interaction**: User enters `username` and `password` in `LoginComponent`.
2.  **Service Call**: Component calls `MockAuthService.login(username, password)`.
3.  **Authentication**:
    -   The service searches the `MOCK_USERS` array (in `mock-users.config.ts`) for a match.
    -   **Success**:
        -   The full `User` object (including their specific `permissions` list) is pushed to the `currentUserSubject`.
        -   The user object is saved to `localStorage` (to survive page reloads).
        -   Returns `true`.
    -   **Failure**: Returns `false`.
4.  **Navigation**: On success, `LoginComponent` navigates to `/dashboard`.

## 2. Access Control (Guards)
Once logged in, two Guards protect the routes (`app-routing.module.ts`):

-   **AuthGuard**:
    -   Checks `AuthService.isAuthenticated()`.
    -   If not logged in, redirects to `/auth/login`.
-   **PermissionGuard**:
    -   Checks the `data: { permission: '...' }` on the route.
    -   Verifies if the *current user's* permission list contains that specific code.
    -   Example: To access `/admin`, user needs `MOD_ADMIN`.

## 3. Role Examples & Permissions

Here is how different users experience the system based on their assigned permissions.

### 👮 Administrator (`admin`)
-   **Permissions**: Has **ALL** permissions (`MOD_ADMIN`, `MOD_PATIENTS`, `MOD_BILLING`, etc.).
-   **Experience**: Can see every menu item. Can access every route. Can delete/edit data everywhere.

### 👨‍⚕️ Doctor (`doctor`)
-   **Permissions**: `MOD_PATIENTS`, `MOD_APPOINTMENTS`, `MOD_CONSULTATION`, `MOD_TRIAGE`.
-   **Experience**:
    -   ✅ Can view Patient List and Medical Records.
    -   ✅ Can Start Consultation and Prescribe Medicine.
    -   ❌ **Cannot** access Billing or Admin Setup (Menu items hidden, Routes blocked).

### 👩‍⚕️ Nurse (`nurse`)
-   **Permissions**: `MOD_PATIENTS`, `MOD_TRIAGE`, `MOD_APPOINTMENTS` (View only).
-   **Experience**:
    -   ✅ Can enter Triage Vitals (BP, Pulse).
    -   ✅ Can see Patient List.
    -   ❌ **Cannot** Prescribe Medicine (No `ACT_CREATE` on Consultation).
    -   ❌ **Cannot** access Billing.

### 🧪 Lab Technician (`lab`)
-   **Permissions**: `MOD_LAB`, `MOD_PATIENTS` (Basic View).
-   **Experience**:
    -   ✅ Can view Lab Requests.
    -   ✅ Can enter Test Results (`CMP_LAB_ENTRY`).
    -   ❌ **Cannot** see Doctor's Consultation notes.

### 💁 Front Desk (`reception`)
-   **Permissions**: `MOD_APPOINTMENTS`, `MOD_BILLING`, `MOD_PATIENTS`.
-   **Experience**:
    -   ✅ Can Register new Patients (`CMP_PATIENT_ADD`).
    -   ✅ Can Book Appointments.
    -   ✅ Can Generate Invoices.
    -   ❌ **Cannot** see Clinical Data (Triage, Consultation, Lab).

## 4. Code Structure
-   `src/app/core/config/mock-users.config.ts`: **The Source of Truth**. Defines which role has which permission strings.
-   `src/app/core/constants/permissions.constants.ts`: The list of all available keys (e.g. `MOD_BILLING`).
-   `src/app/core/guards/guards.ts`: The logic that enforces the rules.
