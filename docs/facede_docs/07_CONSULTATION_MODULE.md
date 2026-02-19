# Consultation Module — Facade Documentation

## What

The Consultation facade manages the doctor queue, encounter lifecycle (create, load, update, finish), prescription management, and clinical notes — the most complex facade in the system.

## Where

| File | Role |
|------|------|
| `src/app/features/consultation/facades/consultation.facade.ts` | **Facade** |
| `src/app/features/consultation/components/consultation-list/` | Consumer — doctor queue table |
| `src/app/features/consultation/components/consultation-detail/` | Consumer — encounter workspace (tabs: vitals, notes, prescription, labs) |
| `src/app/features/consultation/components/consultation-history/` | Presentational — `@Input()` only, OnPush |
| `src/app/features/consultation/components/diagnosis-notes/` | Presentational — `@Input/@Output` only, OnPush |
| `src/app/features/consultation/components/prescription/` | Presentational — `@Input/@Output` only, OnPush |

## Why

**Before**: `ConsultationDetailComponent` was **230 lines** with:
- Direct `EncounterService` injection for loading, creating, updating, and finishing encounters
- Direct `AppointmentService` injection for starting encounters from appointments
- Complex `ngOnInit` branching on route params (`encounterId` vs `appointmentId`)
- Inline subscribe chains with error handling
- Prescription save logic
- Clinical notes update logic

**After**: **120 lines**. All service calls moved to facade. Component only manages local form state.

### Presentational Components

`ConsultationHistoryComponent`, `DiagnosisNotesComponent`, and `PrescriptionComponent` are **pure presentational components** — they only use `@Input`/`@Output`. They were not changed functionally, only had `OnPush` added since they don't manage async state.

## How

### Signals

| Signal | Type | Description |
|--------|------|-------------|
| `encounter` | `Signal<EncounterResponse \| null>` | Current active encounter |
| `doctorQueue` | `Signal<EncounterResponse[]>` | Doctor's consultation queue |
| `prescription` | `Signal<PrescriptionItem[]>` | Current encounter's prescription |

### Computed

| Computed | Logic |
|----------|-------|
| `queueCount` | `doctorQueue().length` |

### Actions (7 methods)

| Method | Description |
|--------|-------------|
| `loadDoctorQueue(doctorId)` | Fetches encounters where doctor is assigned |
| `loadEncounterById(id)` | Fetches encounter details for the workspace |
| `startEncounterFromAppointment(appointmentId, onSuccess, onError)` | Creates/starts an encounter from an appointment |
| `updateClinicalNotes(encounterId, data)` | Saves diagnosis, chief complaint, and notes |
| `savePrescription(encounterId, items)` | Saves prescription items for encounter |
| `finishConsultation(encounterId, notes, onSuccess)` | Saves notes + marks encounter completed |

### Component Changes

#### ConsultationDetailComponent (230 → 120 lines)

```diff
- constructor(
-   private encounterService: EncounterService,
-   private appointmentService: AppointmentService,
-   private messageService: MessageService,
-   ...
- ) {}
+ constructor(
+   public facade: ConsultationFacade,
+   private messageService: MessageService,
+   ...
+ ) {}

// Starting encounter from appointment:
- this.appointmentService.startEncounter(aptId).subscribe(...)
+ this.facade.startEncounterFromAppointment(aptId, (encounter) => {
+   this.patientName = encounter.patientName;
+ }, (msg) => this.errorAndRedirect(msg));

// Saving notes:
- this.encounterService.updateNotes(id, data).subscribe(...)
+ this.facade.updateClinicalNotes(id, data);

// Finishing consultation:
- this.encounterService.finishEncounter(id, data).subscribe(...)
+ this.facade.finishConsultation(id, data, () => {
+   this.router.navigate(['/consultation']);
+ });
```

#### Template Changes

```diff
- [loading]="loading"
+ [loading]="facade.saving()"

- *ngIf="loading"
+ *ngIf="facade.loading()"
```

#### ConsultationListComponent

```diff
- [data]="opdQueue"
+ [data]="facade.doctorQueue()"
+ [loading]="facade.loading()"
```

#### Presentational Components (3) — OnPush only

```diff
+ changeDetection: ChangeDetectionStrategy.OnPush
```

No logic changes needed since they only use `@Input`/`@Output`.
