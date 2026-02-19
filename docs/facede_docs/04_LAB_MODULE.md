# Lab Module — Facade Documentation

## What

The Lab facade manages the lab request queue, test catalog, result entry, and status updates through Angular Signals.

## Where

| File | Role |
|------|------|
| `src/app/features/lab/facades/lab.facade.ts` | **Facade** |
| `src/app/features/lab/components/lab-request-list/` | Consumer — queue table |
| `src/app/features/lab/components/test-request/` | Consumer — order new test form |
| `src/app/features/lab/components/lab-test-entry/` | Consumer — enter results form |
| `src/app/features/lab/components/lab-report-view/` | Consumer — read-only report view |

## Why

**Before**: `LabRequestListComponent` held its own `requests` array with direct `LabService.getLabRequests()` subscribes. `TestRequestComponent` injected both `LabService` and `PatientService`. `LabTestEntryComponent` (203 lines) had a complex form + save logic that mixed UI and backend concerns.

**After**: Facade owns `labQueue`, `labTests`, `selectedRequest`. Components are thin UI shells.

## How

### Signals

| Signal | Type | Description |
|--------|------|-------------|
| `labQueue` | `Signal<LabRequest[]>` | All lab requests (the queue) |
| `labTests` | `Signal<LabTest[]>` | Test catalog for dropdown |
| `selectedRequest` | `Signal<LabRequest \| null>` | Currently viewed/edited request |

### Computed

| Computed | Logic |
|----------|-------|
| `pendingCount` | Count of requests with status `ORDERED` or `SAMPLED` |

### Actions (7 methods)

| Method | Description |
|--------|-------------|
| `loadQueue(status?, encounterId?)` | Fetches lab requests, optionally filtered |
| `loadLabTests()` | Fetches test catalog for dropdowns |
| `loadRequestById(id)` | Fetches single lab request |
| `createRequest(request, onSuccess)` | Creates a new lab request + toast |
| `updateStatus(id, status)` | Updates request status |
| `addResults(id, results, onSuccess)` | Submits test results + marks completed + toast |

### Component Changes

#### LabRequestListComponent

```diff
- [data]="requests"
+ [data]="facade.labQueue()"
+ [loading]="facade.loading()"
```

#### TestRequestComponent

```diff
- this.labService.getAllLabTests().subscribe(data => this.tests = data);
+ this.facade.loadLabTests();

// Template:
- [options]="tests"
+ [options]="facade.labTests()"
```

#### LabTestEntryComponent — save via facade

```diff
- this.labService.addResults(+this.requestId, results).subscribe(...)
+ this.facade.addResults(+this.requestId, results, () => {
+   this.router.navigate(['/lab']);
+ });

// Template:
- [loading]="saving"
+ [loading]="facade.saving()"
```

### Bug Fix

The `pendingCount` computed originally used string literals `'PENDING'` and `'SAMPLE_COLLECTED'` which don't exist in the `LabRequestStatus` enum. Fixed to use `LabRequestStatus.ORDERED` and `LabRequestStatus.SAMPLED`.
