# 05 — Data Flow & State Management

## Overview

HMS v3 uses a layered data flow architecture. Data moves through clearly defined layers from the UI to the backend and back:

```
User Interaction → Component → Facade → Service → ApiService → Interceptors → Backend
                  ← Signal ─── ← ────── ← Observable ←──────── ← ──────────── ← JSON
```

---

## Layer-by-Layer Breakdown

### Layer 1: Component (UI)

Components are **thin** — they contain almost no business logic. Their responsibilities are:
1. Inject the module's Facade
2. Call Facade methods in response to user actions
3. Read Facade's Signals for rendering

```typescript
// Example: PatientListComponent (simplified)
export class PatientListComponent implements OnInit {
  constructor(public facade: PatientFacade) {}

  ngOnInit() {
    this.facade.loadPatients();  // Trigger data fetch
  }

  onSearch(query: string) {
    this.facade.loadPatients(query);  // Trigger filtered fetch
  }

  onDelete(id: number) {
    this.facade.deletePatient(id);  // Trigger delete
  }
}
```

In the template:
```html
<!-- Read signals directly -->
<p-progressSpinner *ngIf="facade.loading()"></p-progressSpinner>
<p-table [value]="facade.patients()">...</p-table>
<span>Total: {{ facade.totalRecords() }}</span>
```

---

### Layer 2: Facade (State Management)

Facades are the **brain** of each module. They:
1. Hold all state via Angular Signals
2. Orchestrate Service calls
3. Manage loading/saving/error states
4. Show toast notifications via `MessageService`
5. Provide computed/derived state

```typescript
// Example: PatientFacade.loadPatients() (simplified)
loadPatients(query?: string, page = 0, size = 10): void {
  this.loading.set(true);          // 1. Set loading state
  this.error.set(null);            // 2. Clear previous errors

  this.patientService.getPatients(query, page, size)
    .subscribe({
      next: (response) => {
        this.patients.set(response.content);     // 3. Update data signal
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);                 // 4. Clear loading
      },
      error: () => {
        this.loading.set(false);                 // 5. Clear loading on error
        this.messageService.add({                // 6. Show error toast
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load patients',
        });
      },
    });
}
```

**Pattern for mutations (create/update/delete):**
```typescript
registerPatient(patient: any, onSuccess: () => void): void {
  this.saving.set(true);                      // 1. Set saving state
  this.patientService.registerPatient(patient)
    .subscribe({
      next: () => {
        this.saving.set(false);               // 2. Clear saving
        this.messageService.add({             // 3. Success toast
          severity: 'success',
          summary: 'Success',
          detail: 'Patient Registered',
        });
        onSuccess();                          // 4. Callback (e.g., navigate away)
      },
      error: () => {
        this.saving.set(false);               // 5. Clear saving on error
        this.messageService.add({             // 6. Error toast
          severity: 'error',
          detail: 'Failed to save patient',
        });
      },
    });
}
```

---

### Layer 3: Service (HTTP Layer)

Services are **pure HTTP adapters**. They:
1. Define endpoint paths
2. Build HTTP parameters
3. Call `ApiService` generic methods
4. Return raw `Observable<T>`

```typescript
// Example: PatientService (simplified)
export class PatientService {
  private path = 'patients';

  constructor(private apiService: ApiService) {}

  getPatients(query?: string, page = 0, size = 10): Observable<Page<Patient>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (query) params = params.set('query', query);
    return this.apiService.get<Page<Patient>>(this.path, params);
  }

  registerPatient(patient: any): Observable<Patient> {
    return this.apiService.post<Patient>(this.path, patient);
  }
}
```

Services hold **no state** — they are stateless.

---

### Layer 4: ApiService (HTTP Client Wrapper)

Single centralized HTTP client that:
1. Prepends base URL
2. Sets JSON headers
3. Serializes request bodies

```typescript
get<T>(path: string, params?): Observable<T> {
  return this.http.get<T>(this.getUrl(path), {
    headers: this.getHeaders(),
    params,
  });
}
```

---

### Layer 5: Interceptors (HTTP Pipeline)

Two interceptors process every HTTP request/response:

```
Request → AuthInterceptor → ErrorInterceptor → HttpClient → Backend
          (add cookies)      (pass through)

Response ← AuthInterceptor ← ErrorInterceptor ← HttpClient ← Backend
           (handle 401)       (handle 403/404/500)
```

---

## Complete Data Flow Examples

### Example 1: Loading Patient List

```
1. User navigates to /patients
2. PatientListComponent.ngOnInit()
3. → facade.loadPatients()
4.   → facade.loading.set(true)
5.   → patientService.getPatients('', 0, 10)
6.     → apiService.get<Page<Patient>>('patients', params)
7.       → httpClient.get('http://localhost:8080/api/v1/patients?page=0&size=10')
8.         → AuthInterceptor adds withCredentials
9.           → Backend returns JSON { content: [...], totalElements: 42 }
10.        ← ErrorInterceptor passes through (200)
11.      ← AuthInterceptor passes through
12.    ← Observable<Page<Patient>> emits response
13.  ← facade.patients.set(response.content)
14.  ← facade.totalRecords.set(42)
15.  ← facade.loading.set(false)
16. Template auto-updates: table renders patients, loading spinner hides
```

### Example 2: Creating an Appointment

```
1. User fills appointment form, clicks "Create"
2. AppointmentCreateComponent calls facade.createAppointment(data, () => navigate('/appointments'))
3. → facade.saving.set(true)
4. → appointmentService.createAppointment(data)
5.   → apiService.post('/appointments/book', data)
6.     → Backend creates appointment, returns 201
7.   ← Observable emits response
8. ← facade.saving.set(false)
9. ← messageService.add({ severity: 'success', detail: 'Appointment created' })
10. ← onSuccess() callback → router.navigate(['/appointments'])
11. Toast shows "Appointment created successfully"
```

### Example 3: Doctor Consultation Flow (Multi-Step)

```
1. Doctor clicks patient in queue
2. → consultationFacade.startEncounterFromAppointment(appointmentId)
   a. GET /appointments/{appointmentId} → get patient details
   b. POST /encounters (create encounter) → get encounter object
   c. Load prescription for encounter
   d. Navigate to consultation detail view

3. Doctor fills diagnosis
4. → consultationFacade.updateClinicalNotes(encounterId, data)
   a. PUT /encounters/{id}/clinical-notes → save diagnosis

5. Doctor writes prescription
6. → consultationFacade.savePrescription(encounterId, items)
   a. POST /encounters/{id}/prescriptions → save prescription

7. Doctor clicks "Finish Consultation"
8. → consultationFacade.finishConsultation(encounterId, data)
   a. PUT /encounters/{id}/clinical-notes → save final notes
   b. switchMap → PUT /encounters/{id}/complete → mark encounter complete
   c. Navigate back to queue
```

---

## Reactive State Patterns

### Signals vs BehaviorSubjects

The project uses **two** reactive patterns:
- **Angular Signals** — Used in all Facades for component-level reactivity
- **RxJS BehaviorSubject** — Used only in `AuthService` for `currentUser$` (because it needs to work outside Angular's change detection, e.g., in interceptors and guards)

### Computed Signals

Facades use `computed()` for derived state:

```typescript
// AppointmentFacade
readonly todaysAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return this.appointments().filter(a => a.startDateTime?.startsWith(today));
});

// BillingFacade
readonly totalRevenue = computed(() =>
  this.invoices().reduce((sum, inv) => sum + inv.paidAmount, 0));

// LabFacade
readonly pendingCount = computed(() =>
  this.labQueue().filter(r =>
    r.status === 'ORDERED' || r.status === 'SAMPLED').length);

// IpdFacade
readonly occupancyRate = computed(() => {
  const total = this.beds().length;
  if (total === 0) return 0;
  return Math.round((this.occupiedCount() / total) * 100);
});
```

### Loading/Saving State Pattern

Every facade consistently manages UI state:

```
Operation Start       → loading.set(true) or saving.set(true)
Operation Success     → loading.set(false), update data signals, show success toast
Operation Error       → loading.set(false), show error toast
```

This ensures the UI always has spinner/loading indicators and never gets stuck in a loading state.
