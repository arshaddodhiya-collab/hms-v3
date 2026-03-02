# Interceptors Workflow

## Overview
The application uses Angular HTTP Interceptors to intercept and handle HTTP requests and responses globally. Interceptors are located in `src/app/core/interceptors`.
Currently, there are two main interceptors:
1. `AuthInterceptor` (`auth.interceptor.ts`)
2. `ErrorInterceptor` (`error.interceptor.ts`)

These interceptors work together to attach credentials to API requests, handle authentication failures, parse backend errors, and provide a unified error-handling mechanism across the app.

---

## 1. AuthInterceptor (`auth.interceptor.ts`)
### Responsibility
Handles attaching credentials (cookies) to outbound API requests and handles 401 Unauthorized errors globally.

### Workflow
1. **Outgoing Request Phase:** 
   - It intercepts every HTTP request.
   - If the request URL includes `/api/`, it clones the request and sets `withCredentials: true`. This ensures that HttpOnly cookies (like authentication tokens or session IDs) are sent back to the API.
2. **Response/Error Phase:**
   - It listens for errors (`HttpErrorResponse`).
   - If a **401 Unauthorized** error is returned AND the request is not an explicit `login` request, it automatically redirects the user to the `/auth/login` page to re-authenticate. This handles automated logouts for expired sessions.

---

## 2. ErrorInterceptor (`error.interceptor.ts`)
### Responsibility
Provides a centralized way to catch, format, and display HTTP errors to the user via UI notifications, as well as handling specific HTTP status codes by redirecting to appropriate error pages.

### Workflow
1. **Pass-through Initial Load:**
   - It ignores errors resulting from `/auth/me` (which is typically called on initial app load to check if the user is logged in, and might fail initially if they aren't authenticated yet).
2. **Error Catching:**
   - Intercepts the response. If an error occurs, it distinguishes between **Client-side** (`ErrorEvent`) and **Server-side** errors (`HttpErrorResponse`).
3. **Handling Specific Status Codes:**
   - **401 Unauthorized:** Passed through (handled by `AuthInterceptor`, or explicit component logic).
   - **403 Forbidden:** Redirects the user to the `/error/unauthorized` route (indicating they lack permission).
   - **404 Not Found:** Redirects the user to the `/error/not-found` route.
   - **500 Internal Server Error:** Uses PrimeNG's `MessageService` to display a toast notification with the server error message (preventing abrupt redirects that could lose user state mid-workflow).
   - **Other Errors (e.g., 400 Bad Request):** Displays a toast notification with the specific error message returned by the backend (or a generic fallback message showing the status code).

---

## 3. Related Service: ErrorStateService (`error-state.service.ts`)
### Responsibility
The `ErrorStateService` acts as a temporary state store for robust error details. It allows interceptors, components, or error handlers to pass detailed error information (like a 500 Server Error exception or a custom crash trace) to dedicated error viewing components before navigating to them.

### Capabilities
- **`setError(details: ErrorDetails)`**: Saves the error message, HTTP status code, timestamp, URL, and stack trace in memory.
- **`getError()`**: Retrieves the saved error details (used by an Error Page component to display the context to the user).
- **`clearError()`**: Clears the stored error from memory after it has been displayed.

*Note: While `ErrorInterceptor` currently relies heavily on `MessageService` and direct routing for UI feedback, `ErrorStateService` is available in the architecture if you later need to navigate to a dedicated Error component and pass a full error context payload without losing it during the route change.*

---

## How They Work Together (The Flow)

In Angular, interceptors execute in the order they are provided in the app configuration (typically `app.config.ts` or `core.module.ts`).

1. **Outgoing (Request):** 
   - The application makes an HTTP call.
   - It hits the **`AuthInterceptor`**, which appends `withCredentials: true` to the request (if going to the API).
   - It hits the **`ErrorInterceptor`** (passes through).
   - The request hits the backend API.

2. **Incoming (Response/Error):** 
   - The response comes back.
   - It hits the **`ErrorInterceptor`**. If there's an error like 403, 404, 500, or a Client Error, a PrimeNG toast notification is displayed, or a page redirect happens.
   - It hits the **`AuthInterceptor`**. If a 401 Unauthorized occurs, it redirects the user to the login screen.
   - The final result (or error throw) is passed to the component/service that initiated the request.
