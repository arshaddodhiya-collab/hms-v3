# Dashboard Module — Facade Documentation

## What

The Dashboard facade centralizes user session info (role, username), doctor-specific appointment loading, and dashboard stats/activity into Angular Signals.

## Where

| File | Role |
|------|------|
| `src/app/features/dashboard/facades/dashboard.facade.ts` | **Facade** |
| `src/app/features/dashboard/components/dashboard/` | Consumer — main dashboard page |
| `src/app/features/dashboard/components/stats-cards/` | Independent — own data loading + OnPush |
| `src/app/features/dashboard/components/today-activity/` | Independent — own data loading + OnPush |

## Why

**Before**: `DashboardComponent` (53 lines) had direct `AuthService` calls to get user info, and conditionally loaded doctor appointments via `AppointmentService`. The template read `username`, `userRole`, and `myAppointments` as plain component properties.

**After**: Facade owns `username()`, `userRole()`, `myAppointments()` as signals. Adding `OnPush` required either signals or `ChangeDetectorRef.markForCheck()`.

### Special Note: StatsCardsComponent & TodayActivityComponent

These two components perform their own permission-based filtering (mapping `DashboardDTO` to stat cards, mapping `ActivityDTO` to filtered activities). Because this logic is presentation-specific (varies per component), it was **not** moved to the facade. Instead, they:

1. Keep their own `.subscribe()` calls
2. Use `ChangeDetectorRef.markForCheck()` after setting data — **required** for `OnPush` + async subscribe pattern

## How

### Signals

| Signal | Type | Description |
|--------|------|-------------|
| `stats` | `Signal<DashboardDTO \| null>` | Raw dashboard stats |
| `activities` | `Signal<ActivityDTO[]>` | Recent activity feed |
| `myAppointments` | `Signal<AppointmentResponse[]>` | Doctor's upcoming appointments |
| `userRole` | `Signal<string>` | Current user's role (e.g., `'Doctor'`) |
| `username` | `Signal<string>` | Current user's display name |

### Actions

| Method | Description |
|--------|-------------|
| `loadDashboard()` | Loads user info, stats, activity, and conditionally loads doctor appointments |
| `logout()` | Delegates to `AuthService.logout()` |

### Component Changes

#### DashboardComponent (53 → 24 lines)

```diff
- this.authService.getCurrentUser() → local properties
+ this.facade.loadDashboard()

// Template:
- {{ username }}
+ {{ facade.username() }}

- *ngIf="userRole === 'Doctor'"
+ *ngIf="facade.userRole() === 'Doctor'"

- [value]="myAppointments"
+ [value]="facade.myAppointments()"
```

#### StatsCardsComponent — OnPush fix

```diff
+ import { ChangeDetectorRef } from '@angular/core';

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
+   private cdr: ChangeDetectorRef,
  ) {}

  loadStats() {
    this.dashboardService.getStats().subscribe((data) => {
      this.stats = allStats.filter(...);
+     this.cdr.markForCheck(); // Required for OnPush
    });
  }
```

#### TodayActivityComponent — same fix

```diff
+ private cdr: ChangeDetectorRef

  this.activities = allActivities.filter(...);
+ this.cdr.markForCheck();
```

### Key Lesson

> When a component has `OnPush` and uses `.subscribe()` to set properties, Angular won't detect the change. You must either:
> 1. Use **signals** (facade pattern), or
> 2. Call `ChangeDetectorRef.markForCheck()` after the subscribe callback
