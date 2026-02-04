# Walkthrough - Service-Based Architecture

I have refactored the core application flow to use **Singleton Services** with RxJS state management. This ensures that data created in one view persists and can be accessed across the application.

## Key Changes

### 1. Global State Management
I replaced the mock data arrays inside components with centralized services in `src/app/core/services/`.
- **PatientService**: Manages the list of patients. Uses `BehaviorSubject` to hold state.
- **AppointmentService**: Manages the list of visits/appointments.

### 2. Connected Components
refactored the following components to consume these services:

#### Patient List (`/patients`)
- Now fetches data from `PatientService`.
- **Create Patient**: Adds to the global store via `patientService.addPatient()`.
- **Delete Patient**: Removes from the global store.

#### Appointment List (`/appointments`)
- Now fetches data from `AppointmentService`.
- **Create Appointment**: adds a new visit to the store.

## How to Test
1.  Go to **Patients**.
2.  Click "New Patient", fill in details, and Save.
3.  Navigate away to Dashboard and come back. **The new patient should still be there**.
4.  Go to **Appointments**.
5.  Create a new appointment.
6.  The appointment is saved in memory (will reset on browser refresh, but persists during navigation).

### 3. Triage Module
- **TriageService**: Manages vital signs.
- **Queue**: List of pending appointments (`/triage`).
- **Vitals Entry**: Records BP, Temp, etc. and updates visit status.

### 4. IPD Module
- **IpdService**: Manages Admissions and Beds.
- **Admission**: New Admission Form (`/ipd/admit`) to assign beds.
- **Bed Management**: Real-time view of bed occupancy (`/ipd/beds`).

### 5. Lab Module
- **LabService**: Manages Test Requests and Results.
- **Test Requests**: Form for doctors to order tests (`/lab/request`).
- **Lab Queue**: List of pending tests (`/lab`).
- **Result Entry**: Form to enter results updates status to 'Completed'.

### 6. Billing Module
- **BillingService**: Manages Invoices.
- **Functions**: Create Invoice, Payment status updates.
- **Integration**: Linked to Billing Summary view.

## How to Test
1.  **OPD Flow**:
    - Create Appointment -> Go to Triage -> Record Vitals.
2.  **IPD Flow**:
    - Go to IPD -> New Admission -> Select Patient & Bed -> Save.
    - Check "Bed Management" to see the bed occupied.
3.  **Lab Flow**:
    - Go to Lab -> New Request -> Select Patient/Test -> Save.
    - see it in Lab Queue -> Enter Results.
4.  **Billing Flow**:
    - Go to Billing -> Create Invoice or View existing.
