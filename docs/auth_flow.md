# Access Control & Permissions Guide

This document explains the Role-Based Access Control (RBAC) architecture in HMS v3.

## 1. Architecture Overview

 The application uses a **Permission-Based** security model (not just Role-Based). This means access is granted based on specific *capabilities* (e.g., `CMP_VITALS_WRITE`) rather than just the user's role name.

### Components
1.  **Constants** (`permissions.constants.ts`): Single source of truth for all permission keys.
2.  **User Config** (`mock-users.config.ts`): Maps Roles (Doctor, Nurse) to a list of Permissions.
3.  **Auth Service** (`mock-auth.service.ts`): Holds the current user state and checks `user.permissions.includes(requiredPermission)`.
4.  **Guards** (`guards.ts`): Protects URL routes.
5.  **Directives** (`has-permission.directive.ts`): Hides/Shows UI elements (buttons, divs).

---

## 2. Enforcement Mechanisms

### A. Route Protection (Page Access)
Used in `*-routing.module.ts`. Prevents unauthorized users from even loading a page.

```typescript
{
  path: 'consultation',
  component: ConsultationListComponent,
  canActivate: [PermissionGuard],
  data: { permission: 'MOD_CONSULTATION' } // Only users with this permission can enter
}
```

### B. UI Hiding (Element Access)
Used in HTML templates. Hides buttons or sections user shouldn't touch.

```html
<!-- Only users with WRITE permission see the Edit button -->
<button *appHasPermission="'CMP_CONSULTATION_WRITE'" label="Edit"></button>
```

### C. Menu Filtering (Sidebar)
Used in `sidebar.component.ts`. Filters the navigation menu based on permissions.
*   The Sidebar iterates through `MENU_CONFIG`.
*   If `AuthService.hasPermission(item.permission)` is false, the link is hidden.

---

## 3. Permission Matrix

| Permission | Description | Admin | Doctor | Nurse | Reception | Lab |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Modules (Sidebar)** | | | | | | |
| `MOD_DASHBOARD` | Access Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| `MOD_PATIENTS` | Access Patient List | ✅ | ✅ | ✅ | ✅ | ✅ |
| `MOD_APPOINTMENTS` | Access Calendar | ✅ | ✅ | ✅ | ✅ | ❌ |
| `MOD_TRIAGE` | Access Vitals/Triage | ✅ | ✅ | ✅ | ❌ | ❌ |
| `MOD_CONSULTATION` | Access Doctor Notes | ✅ | ✅ | ✅ | ❌ | ❌ |
| `MOD_LAB` | Access Lab Results | ✅ | ❌ | ❌ | ❌ | ✅ |
| `MOD_BILLING` | Access Payments | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Actions** | | | | | | |
| `CMP_VITALS_WRITE` | Enter Triage Vitals | ✅ | ❌ | ✅ | ❌ | ❌ |
| `CMP_VITALS_READ` | View Vitals | ✅ | ✅ | ✅ | ❌ | ❌ |
| `CMP_CONSULTATION_WRITE` | Write Diagnosis/Rx | ✅ | ✅ | ❌ | ❌ | ❌ |
| `CMP_CONSULTATION_READ` | Read Diagnosis/Rx | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 4. User Roles & Workflows

### 👮 Administrator (`admin`)
*   **Access**: Everything.
*   **Workflow**: System setup, override actions, full visibility.

### 👨‍⚕️ Doctor (`doctor`)
*   **Focus**: Clinical Care.
*   **Workflow**:
    1.  View **Dashboard** for schedule.
    2.  Check **Triage** (Read-Only) to see Vitals.
    3.  Go to **Consultation**.
    4.  **Write** Diagnosis and Prescriptions.
*   **Restrictions**: Cannot see Billing or perform Lab Entry.

### 👩‍⚕️ Nurse (`nurse`)
*   **Focus**: Patient Intake & Care.
*   **Workflow**:
    1.  Check **Appointments**.
    2.  Go to **Triage**.
    3.  **Enter** Vitals (`CMP_VITALS_WRITE`).
    4.  Can **Read** Consultation notes (`CMP_CONSULTATION_READ`) to follow up on instructions.
*   **Restrictions**: Cannot Prescribe Medicine (`CMP_CONSULTATION_WRITE` denied) or see Billing.

### 💁 Reception (`reception`)
*   **Focus**: Front Desk.
*   **Workflow**:
    1.  **Register** Patients.
    2.  **Book** Appointments.
    3.  **Billing** & Invoices.
*   **Restrictions**: No access to Clinical Data (Triage, Consultation, Lab).

### 🧪 Lab Tech (`lab`)
*   **Focus**: Diagnostics.
*   **Workflow**:
    1.  Processing Lab Requests.
    2.  Entering Results.
*   **Restrictions**: Limited view of Patients; no Consultation access.
