# HMS v3 — Frontend Code Flow Documentation

> **Hospital Management System v3** — A comprehensive Angular 17 frontend application for managing hospital operations including patient registration, appointments, triage, consultations, lab diagnostics, inpatient care (IPD), billing, and administration.

---

## Table of Contents

| # | Document | Description |
|---|----------|-------------|
| 1 | [Architecture Overview](./01-architecture-overview.md) | High-level project architecture, folder structure, tech stack, and design patterns |
| 2 | [Core Module](./02-core-module.md) | Services, guards, interceptors, facades, config, and models in `core/` |
| 3 | [Shared Module](./03-shared-module.md) | Reusable components, directives, and PrimeNG module exports |
| 4 | [Feature Modules](./04-feature-modules.md) | All 12 feature modules — Auth, Dashboard, Patients, Appointments, Triage, Consultation, Lab, IPD, Billing, Admin, Error, Voice Navigation |
| 5 | [Data Flow & State Management](./05-data-flow.md) | Signal-based facade pattern, component-to-API data flow, and reactive state |
| 6 | [Routing & Guards](./06-routing-and-guards.md) | Full route map, lazy loading, AuthGuard, PermissionGuard, and role-based access |
| 7 | [Models & Interfaces](./07-models-and-interfaces.md) | All TypeScript interfaces, enums, and data contracts |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
# → http://localhost:4200

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Angular | 17.3.x |
| UI Library | PrimeNG | 17.18.x |
| CSS Utilities | PrimeFlex | 4.0.x |
| Icons | PrimeIcons | 7.0.x |
| Reactive | RxJS | 7.8.x |
| Search | Fuse.js | 7.1.x |
| AI Integration | Google GenAI | 1.42.x |
| Language | TypeScript | 5.4.x |

---

## Project Structure Overview

```
src/app/
├── app.module.ts              # Root module
├── app-routing.module.ts      # Top-level lazy-loaded routes
├── app.component.ts/html      # Root shell (sidebar + content layout)
│
├── core/                      # Singleton services & infrastructure
│   ├── config/                # Menu config, mock users
│   ├── constants/             # Permission constants
│   ├── facades/               # BaseFacade abstract class
│   ├── guards/                # AuthGuard, PermissionGuard
│   ├── interceptors/          # AuthInterceptor, ErrorInterceptor
│   ├── models/                # Shared TypeScript interfaces
│   └── services/              # ApiService, UserService, ErrorStateService
│
├── shared/                    # Reusable components & directives
│   ├── components/            # Sidebar, Table, PageHeader, StatusBadge, etc.
│   ├── directives/            # HasPermissionDirective, VoiceInputDirective
│   ├── models/                # Shared models
│   └── shared.module.ts       # Exports components + PrimeNG modules
│
└── features/                  # Lazy-loaded feature modules
    ├── auth/                  # Login & authentication
    ├── dashboard/             # Dashboard with stats & activity
    ├── patients/              # Patient registration & management
    ├── appointments/          # Appointment scheduling & lifecycle
    ├── triage/                # Vitals recording & triage queue
    ├── consultation/          # Doctor consultations & prescriptions
    ├── lab/                   # Lab test requests & results
    ├── ipd/                   # Inpatient admissions & bed management
    ├── billing/               # Invoice generation & payments
    ├── admin/                 # Users, departments, roles management
    ├── error/                 # Error pages (404, 403, 500)
    └── voice-navigation/      # Voice command navigation
```

---

## Mock Users for Development

| Username | Password | Role | Key Permissions |
|----------|----------|------|----------------|
| `admin` | `123` | Administrator | All modules and actions |
| `doctor` | `123` | Doctor | Dashboard, Patients, Appointments, Consultation |
| `nurse` | `123` | Nurse | Dashboard, Patients, Triage, Consultation (read) |
| `lab` | `123` | Lab Technician | Dashboard, Lab module |
| `reception` | `123` | Front Desk | Dashboard, Patients, Appointments, Billing |
