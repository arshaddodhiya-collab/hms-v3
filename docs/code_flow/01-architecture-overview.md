# 01 — Architecture Overview

## Design Philosophy

HMS v3 follows a **modular, layered Angular architecture** that enforces separation of concerns, scalability, and maintainability. The core design principles are:

1. **Feature-based modules** — Each hospital workflow (Patients, Appointments, Lab, etc.) lives in its own lazy-loaded module
2. **Facade pattern** — Signal-based facades sit between components and services, managing all state
3. **Singleton core** — Infrastructure services (API, auth, interceptors) are loaded once in `CoreModule`
4. **Shared UI** — Reusable components and PrimeNG modules are exported from `SharedModule`
5. **Permission-driven UI** — Every route and UI element can be guarded by granular permission strings

---

## Architectural Layers

```
┌──────────────────────────────────────────────────────────────┐
│                        COMPONENTS                             │
│  (Templates + Component Classes — UI logic only)              │
│  • Read state from Facade signals                            │
│  • Call Facade methods for actions                           │
├──────────────────────────────────────────────────────────────┤
│                         FACADES                               │
│  (Signal-based state management)                              │
│  • Hold all module state via Angular Signals                 │
│  • Orchestrate service calls                                 │
│  • Manage loading/error/saving states                        │
│  • Show PrimeNG toast notifications                          │
├──────────────────────────────────────────────────────────────┤
│                        SERVICES                               │
│  (Pure HTTP communication layer)                              │
│  • Map to REST API endpoints                                 │
│  • Return RxJS Observables                                   │
│  • No state management                                       │
├──────────────────────────────────────────────────────────────┤
│                       API SERVICE                             │
│  (Centralized HTTP wrapper)                                   │
│  • Base URL management                                       │
│  • Standard headers                                          │
│  • Generic CRUD methods                                      │
├──────────────────────────────────────────────────────────────┤
│                      INTERCEPTORS                             │
│  (HTTP pipeline middleware)                                    │
│  • AuthInterceptor: Attach cookies, handle 401               │
│  • ErrorInterceptor: Global error handling, routing           │
├──────────────────────────────────────────────────────────────┤
│                    BACKEND API (Spring Boot)                   │
│  Base URL: http://localhost:8080/api/v1                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Module Loading Strategy

```
AppModule (eagerly loaded)
├── CoreModule (eagerly loaded — singleton guard prevents re-import)
├── SharedModule (eagerly loaded — exports reusable UI)
└── AppRoutingModule (lazy loads all features)
    ├── AuthModule        → /auth/**
    ├── DashboardModule   → /dashboard
    ├── PatientsModule    → /patients/**
    ├── AppointmentsModule→ /appointments/**
    ├── TriageModule      → /triage/**
    ├── ConsultationModule→ /consultation/**
    ├── LabModule         → /lab/**
    ├── IpdModule         → /ipd/**
    ├── BillingModule     → /billing/**
    ├── AdminModule       → /admin/**
    ├── ErrorModule       → /error/**
    └── VoiceNavigationModule → /voice
```

All feature modules use **lazy loading** via `loadChildren` in `app-routing.module.ts`. This means each module's code is only downloaded when the user navigates to that section, improving initial load performance.

---

## Application Shell

The root `AppComponent` manages the application shell:

```
┌────────────────────────────────────────────────────┐
│                                                     │
│  ┌─────────┐  ┌────────────────────────────────┐   │
│  │         │  │      Mobile Topbar (hamburger)  │   │
│  │         │  ├────────────────────────────────┤   │
│  │ Sidebar │  │                                │   │
│  │ (menu)  │  │        <router-outlet>         │   │
│  │         │  │        (feature content)       │   │
│  │         │  │                                │   │
│  └─────────┘  └────────────────────────────────┘   │
│                                                     │
│  <p-toast>     ← Global toast notifications         │
│  <app-voice-hud> ← Voice control floating widget    │
└────────────────────────────────────────────────────┘
```

**Key behaviors:**
- **Desktop**: Sidebar is always visible (static)
- **Mobile**: Sidebar is a PrimeNG drawer (`p-sidebar`) toggled via hamburger button
- **Auth/Error routes**: Sidebar and topbar are hidden — full-screen layout
- **Route change on mobile**: Sidebar auto-closes

The `showLayout` getter controls visibility:
```typescript
get showLayout(): boolean {
  return this.isLoggedIn && !this.isAuthRoute;
}
```

---

## State Management Pattern: Signal-Based Facades

Instead of using a third-party state management library (NgRx, Akita, etc.), HMS v3 uses **Angular Signals within Facade classes**. This provides:

- **Simplicity**: No boilerplate actions/reducers/effects
- **Reactivity**: Signals auto-propagate changes to templates
- **Type safety**: Direct TypeScript generics
- **Computed state**: Derived values via `computed()` signals

### BaseFacade Abstract Class

Every feature facade extends `BaseFacade<T>`:

```typescript
export abstract class BaseFacade<T> {
  readonly data = signal<T[]>([]);
  readonly selectedItem = signal<T | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly hasData = computed(() => this.data().length > 0);
  readonly isEmpty = computed(() => !this.loading() && this.data().length === 0);
  readonly count = computed(() => this.data().length);

  abstract load(): void;
  select(item: T | null): void { ... }
  clearError(): void { ... }
}
```

### Facade Pattern in Practice

```
Component                    Facade                     Service
    │                          │                          │
    │── facade.load() ────────►│                          │
    │                          │── service.getData() ────►│
    │                          │                          │── HTTP GET /api/v1/...
    │                          │                          │◄── JSON Response
    │                          │◄── Observable<Data[]> ───│
    │                          │                          │
    │                          │── this.data.set(result)  │
    │                          │── this.loading.set(false) │
    │                          │                          │
    │◄── Signal auto-update ───│                          │
    │   (template re-renders)  │                          │
```

---

## Security Architecture

### Cookie-Based Authentication
- Login sends credentials to `/api/v1/auth/login`
- Backend sets an HTTP-only cookie
- `AuthInterceptor` adds `withCredentials: true` to all API requests
- Cookie is automatically sent with every request

### Two-Layer Route Protection

1. **AuthGuard** — Checks if the user is logged in (has a user in the `BehaviorSubject`)
2. **PermissionGuard** — Checks if the user has the specific permission string defined in route `data`

### UI-Level Permission Control
- `HasPermissionDirective` (`*appHasPermission="'CMP_PATIENT_ADD'"`) — structural directive that creates/destroys DOM elements based on permissions
- `SidebarComponent.filterMenu()` — recursively filters the menu tree by permission

---

## Backend API Integration

| Frontend Concept | Backend Endpoint Pattern |
|-----------------|------------------------|
| `ApiService.get<T>(path)` | `GET /api/v1/{path}` |
| `ApiService.post<T>(path, body)` | `POST /api/v1/{path}` |
| `ApiService.put<T>(path, body)` | `PUT /api/v1/{path}` |
| `ApiService.patch<T>(path, body)` | `PATCH /api/v1/{path}` |
| `ApiService.delete<T>(path)` | `DELETE /api/v1/{path}` |

The `ApiService` is a thin wrapper around Angular's `HttpClient` that:
1. Prepends the base URL (`http://localhost:8080/api/v1`)
2. Sets standard JSON headers
3. Provides generic typed methods

Each feature service then builds on `ApiService` for its specific domain endpoints.
