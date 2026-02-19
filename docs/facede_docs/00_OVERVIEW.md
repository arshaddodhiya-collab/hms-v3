# Facade + Angular Signals Architecture — Overview

## What Is the Facade Pattern?

A **Facade** is a service layer that sits between Components and backend Services. It acts as a single point of contact for all state management and business logic within a module.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Component   │ ──► │   Facade     │ ──► │   Service    │
│  (Dumb UI)   │     │ (State+Logic)│     │ (HTTP calls) │
└──────────────┘     └──────────────┘     └──────────────┘
      reads signals       manages signals       returns Observables
```

### Why?

| Problem (Before)                              | Solution (After)                                       |
|-----------------------------------------------|--------------------------------------------------------|
| Components call services directly             | Components call facade methods                         |
| Components hold business logic (mapping, filtering, grouping) | Facade owns all transformations                        |
| Components manage loading/error/saving states | Facade exposes `loading()`, `saving()`, `error()` signals |
| Multiple service injections per component     | Single facade injection                                |
| Default change detection (expensive)          | `OnPush` + Signals (fast, granular)                    |
| Hard to test components                       | Facades are easily unit-testable                       |

### How It Works

1. **Facade** creates writable `signal()` instances for all reactive state
2. **Facade** exposes `computed()` for derived state (e.g. `pendingCount`, `occupancyRate`)
3. **Facade** has **action methods** that call services, handle errors, and update signals
4. **Component** injects the facade as `public facade: XxxFacade`
5. **Template** reads signals: `facade.data()`, `facade.loading()`
6. **Component** uses `ChangeDetectionStrategy.OnPush` — Angular only re-renders when signals change

---

## Architecture Diagram

```
                    ┌─────────────────────────┐
                    │      BaseFacade<T>       │
                    │  (abstract)              │
                    │  ─────────────────       │
                    │  data: Signal<T[]>       │
                    │  loading: Signal<bool>   │
                    │  saving: Signal<bool>    │
                    │  error: Signal<string>   │
                    │  hasData: Computed<bool>  │
                    └─────────┬───────────────┘
                              │ extends
        ┌─────────┬───────────┼───────────┬──────────┬──────────┐
        ▼         ▼           ▼           ▼          ▼          ▼
   IpdFacade  ApptFacade  LabFacade  BillingFacade DashFacade ConsultFacade
```

---

## Files Created

| File                                                 | Type         |
|------------------------------------------------------|--------------|
| `src/app/core/facades/base-facade.ts`                | Base Class   |
| `src/app/features/ipd/facades/ipd.facade.ts`         | Module Facade |
| `src/app/features/appointments/facades/appointment.facade.ts` | Module Facade |
| `src/app/features/lab/facades/lab.facade.ts`          | Module Facade |
| `src/app/features/billing/facades/billing.facade.ts`  | Module Facade |
| `src/app/features/dashboard/facades/dashboard.facade.ts` | Module Facade |
| `src/app/features/consultation/facades/consultation.facade.ts` | Module Facade |

---

## Key Rules

1. **Components are dumb** — they only manage local UI state (form fields, dialog visibility)
2. **Facades own all reactive state** — signals for data, loading, saving, error
3. **Templates read signals** — `facade.signalName()` in bindings
4. **OnPush everywhere** — all refactored components use `ChangeDetectionStrategy.OnPush`
5. **One facade per feature module** — co-located in `features/<module>/facades/`
6. **`providedIn: 'root'`** — facades are tree-shakeable singletons
