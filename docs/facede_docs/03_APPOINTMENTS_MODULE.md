# Appointments Module — Facade Documentation

## What

The Appointments facade manages appointment listing, CRUD, and status transitions (check-in, cancel, start, complete, no-show, restore) via Angular Signals.

## Where

| File | Role |
|------|------|
| `src/app/features/appointments/facades/appointment.facade.ts` | **Facade** |
| `src/app/features/appointments/components/appointment-list/` | Consumer — table view |
| `src/app/features/appointments/components/appointment-create/` | Consumer — booking form |
| `src/app/features/appointments/components/appointment-edit/` | Consumer — edit form |
| `src/app/features/appointments/components/appointment-view/` | Consumer — detail view |

## Why

**Before**: Each component injected `AppointmentService`, `PatientService`, `UserService`, and `MessageService`. The list component inherited from `BaseCrudComponent` (a heavyweight base class). All 4 components had duplicate subscribe-and-toast patterns.

**After**: One facade, one injection, all state in signals. `BaseCrudComponent` inheritance removed.

## How

### Signals

| Signal | Type | Description |
|--------|------|-------------|
| `appointments` | `Signal<AppointmentResponse[]>` | All appointments |
| `selectedAppointment` | `Signal<AppointmentResponse \| null>` | Currently viewed appointment |
| `todaysAppointments` | `Signal<AppointmentResponse[]>` | Today's appointments |

### Computed

| Computed | Logic |
|----------|-------|
| `scheduledCount` | `appointments` filtered by `SCHEDULED` status |
| `completedCount` | `appointments` filtered by `COMPLETED` status |

### Actions (10 methods)

| Method | Description |
|--------|-------------|
| `loadAll()` | Fetches all appointments for list view |
| `loadById(id)` | Fetches single appointment for detail view |
| `loadTodaysAppointments()` | Fetches today's appointments |
| `createAppointment(request, onSuccess)` | Creates + shows toast + calls callback |
| `updateAppointment(id, request, onSuccess)` | Updates + shows toast + calls callback |
| `checkIn(id)` | Updates status to `CHECKED_IN` + refreshes list |
| `cancel(id)` | Updates status to `CANCELLED` + refreshes list |
| `start(id)` | Updates status to `IN_PROGRESS` |
| `complete(id)` | Updates status to `COMPLETED` |
| `noShow(id)` | Updates status to `NO_SHOW` |

### Component Changes

#### AppointmentListComponent — removed `BaseCrudComponent`

```diff
- export class AppointmentListComponent extends BaseCrudComponent<AppointmentResponse> implements OnInit
+ export class AppointmentListComponent implements OnInit

- constructor(
-   private appointmentService: AppointmentService,
-   private messageService: MessageService,
-   ...
- ) { super(appointmentService, messageService); }
+ constructor(
+   public facade: AppointmentFacade,
+   private router: Router,
+ ) {}
```

#### Template: `appointment-list.component.html`

```diff
- [data]="data"
+ [data]="facade.appointments()"
+ [loading]="facade.loading()"
```

#### AppointmentViewComponent — reads from facade signal

```diff
- *ngIf="appointment"
+ *ngIf="facade.selectedAppointment() as appointment"
```

#### AppointmentEditComponent — mutation via facade

```diff
- this.appointmentService.updateAppointment(this.appointmentId, request).subscribe(...)
+ this.facade.updateAppointment(this.appointmentId, request, () => {
+   this.router.navigate(['/appointments']);
+ });
```
