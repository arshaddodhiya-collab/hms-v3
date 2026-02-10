# Frontend Authentication Configuration

This document outlines the **Cookie-based Authentication** implementation in the Angular Frontend (`hms-v3`).

## 1. Overview
The application uses **HttpOnly Cookies** (`accessToken`, `refreshToken`) for secure authentication. The frontend **does not** store tokens in `localStorage`. Instead, it relies on the browser to automatically send cookies with every request.

## 2. Core Services

### 2.1 AuthService (`src/app/features/auth/services/auth.service.ts`)
*   **Role**: The central hub for authentication state.
*   **Key Methods**:
    *   `login(credentials)`: Sends POST to `/api/v1/auth/login`. Updates local state on success.
    *   `logout()`: Sends POST to `/api/v1/auth/logout`. Clears local state and redirects to login.
    *   `loadCurrentUser()`: Called on App Init. hits `/api/v1/auth/me` to check if a session exists (e.g., after page refresh).
    *   `hasPermission(permission)`: Checks if the current user has the required permission.

### 2.2 AuthInterceptor (`src/app/core/interceptors/auth.interceptor.ts`)
*   **Role**: Automatic request configuration and error handling.
*   **Feature 1: Credentials**: Adds `withCredentials: true` to **ALL** requests targeting the API. This is crucial for Cookies to work.
*   **Feature 2: Auto-Logout**: Intercepts `401 Unauthorized` responses and redirects the user to the Login page (unless it's a login attempt itself).

## 3. Route Protection (Guards)

### 3.1 AuthGuard (`src/app/core/guards/guards.ts`)
*   **Usage**: `canActivate: [AuthGuard]`
*   **Logic**: Checks `authService.isAuthenticated()`. If false, redirects to Login.

### 3.2 PermissionGuard (`src/app/core/guards/guards.ts`)
*   **Usage**: `canActivate: [PermissionGuard], data: { permission: 'MOD_PATIENTS' }`
*   **Logic**: Checks `authService.hasPermission('MOD_PATIENTS')`. If false, shows "Access Denied" toast and blocks navigation.

## 4. UI Rendering

### 4.1 HasPermission Directive (`src/app/shared/directives/has-permission.directive.ts`)
*   **Usage**: `<button *appHasPermission="'ACT_DELETE'">Delete</button>`
*   **Logic**: Dynamically adds or removes the DOM element based on the user's permissions.

### 4.2 Sidebar Permission Filtering
The `SidebarComponent` filters the `MENU_CONFIG` recursively.
*   Items without a `permission` property are **always visible** (e.g., Group Headers).
*   Items with a `permission` property are visible only if `authService.hasPermission()` returns true.

## 5. Configuration

### 5.1 Environment (`src/environments/environment.ts`)
Points to the backend API.
```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api/v1', // Must match backend
};
```

### 5.2 Proxies / CORS
*   The Backend `SecurityConfig` explicitly allows `http://localhost:4200` to support `Allow-Credentials`.
