# IPD Module — Facade Documentation

## What

The IPD (In-Patient Department) facade centralizes all bed management, admission, discharge, and round management state into a single reactive service using Angular Signals.

## Where

| File | Role |
|------|------|
| `src/app/features/ipd/facades/ipd.facade.ts` | **Facade** — state + actions |
| `src/app/features/ipd/components/bed-management/` | Consumer — bed grid UI |
| `src/app/features/ipd/components/admission-list/` | Consumer — admission table |
| `src/app/features/ipd/components/admission-form/` | Consumer — admit patient form |
| `src/app/features/ipd/components/discharge-summary/` | Consumer — discharge workflow |
| `src/app/features/ipd/components/round-form/` | Consumer — add round dialog |

## Why

**Before refactoring**, `BedManagementComponent` was **116 lines** with:
- Direct `forkJoin` calls to `IpdService`
- Manual bed-to-admission mapping via `Map<number, Admission>`
- Ward grouping logic (`groupBedsByWard`)
- Stat calculations (`getAvailableCount`, `getOccupiedCount`, `getOccupancyRate`)
- Filter state (`showAvailable`, `showOccupied`)
- Round form dialog state

This made the component untestable and hard to maintain. **After**: 38 lines, pure UI.

## How

### Signals (State)

| Signal | Type | Description |
|--------|------|-------------|
| `beds` | `Signal<Bed[]>` | All beds with admission data |
| `wards` | `Signal<{name, beds}[]>` | Beds grouped by ward |
| `admissions` | `Signal<Admission[]>` | All active admissions |
| `patients` | `Signal<Patient[]>` | Patients for form dropdown |
| `doctors` | `Signal<any[]>` | Doctors for form dropdown |
| `wardOptions` | `Signal<any[]>` | Ward options for form |
| `availableBeds` | `Signal<Bed[]>` | Available beds for selected ward |
| `showAvailable` | `Signal<boolean>` | Filter: show available beds |
| `showOccupied` | `Signal<boolean>` | Filter: show occupied beds |

### Computed (Derived State)

| Computed | Logic |
|----------|-------|
| `filteredWards` | Filters beds in each ward by `showAvailable`/`showOccupied` toggles |
| `totalBeds` | `beds().length` |
| `occupiedBeds` | Count beds with status `OCCUPIED` |
| `availableBedCount` | `totalBeds - occupiedBeds` |
| `occupancyRate` | `(occupiedBeds / totalBeds) * 100` |
| `admissionList` | Maps admissions with patient/ward/doctor names for table display |

### Actions (Methods)

| Method | What It Does |
|--------|-------------|
| `loadBedData()` | Fetches beds + admissions via `forkJoin`, maps admissions to beds, groups by ward |
| `loadAdmissions()` | Fetches admission list for the table view |
| `loadAdmissionFormData()` | Loads patients, doctors, and wards for the admission form |
| `loadAvailableBeds(wardId)` | Fetches available beds in a specific ward |
| `admitPatient(data)` | Creates a new admission |
| `dischargePatient(id, data)` | Discharges a patient |
| `addRound(admissionId, data)` | Adds a round note to an admission |
| `toggleFilter(filter)` | Toggles bed visibility filters |

### Component Changes

#### BedManagementComponent (116 → 38 lines)

```diff
- constructor(private ipdService: IpdService) {}
+ constructor(public facade: IpdFacade) {}

- ngOnInit() {
-   this.loading = true;
-   forkJoin([...]).subscribe(([beds, admissions]) => {
-     this.mapAdmissionsToBeds(beds, admissions);
-     this.wards = this.groupBedsByWard(beds);
-   });
- }
+ ngOnInit() {
+   this.facade.loadBedData();
+ }
```

#### Template Changes

```diff
- *ngFor="let ward of wards"
+ *ngFor="let ward of facade.filteredWards()"

- {{ getAvailableCount(ward) }}
+ {{ facade.availableBedCount() }}

- [loading]="loading"
+ [loading]="facade.loading()"
```
