import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss'],
})
export class PatientViewComponent implements OnInit {
  patientId: string | null = null;

  // Enhanced Mock Data
  patient: any = {
    id: 1,
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    contact: '1234567890',
    email: 'john.doe@example.com',
    address: '123 Main St, Springfield',
    bloodGroup: 'O+',
    allergies: 'Peanuts, Penicillin',
    avatar:
      'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
    lastVisit: '2023-10-15',
  };

  activeVitals = {
    temperature: '98.6 °F',
    bp: '120/80 mmHg',
    pulse: '72 bpm',
    weight: '75 kg',
    height: '180 cm',
    spo2: '98%',
  };

  appointments = [
    {
      id: 101,
      date: '2023-10-15',
      doctor: 'Dr. Smith',
      type: 'Consultation',
      status: 'Completed',
    },
    {
      id: 102,
      date: '2023-11-20',
      doctor: 'Dr. Adams',
      type: 'Follow-up',
      status: 'Scheduled',
    },
  ];

  prescriptions = [
    {
      id: 501,
      date: '2023-10-15',
      doctor: 'Dr. Smith',
      medicines: ['Amoxicillin 500mg', 'Paracetamol 650mg'],
    },
  ];

  medicalHistory = [
    {
      condition: 'Hypertension',
      diagnosedDate: '2020-05-10',
      status: 'Ongoing',
    },
    {
      condition: 'Fractured Arm',
      diagnosedDate: '2018-02-15',
      status: 'Healed',
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
  }

  getSeverity(
    status: string,
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Scheduled':
        return 'info';
      case 'Cancelled':
        return 'danger';
      case 'Ongoing':
        return 'warning';
      case 'Healed':
        return 'success';
      default:
        return 'info';
    }
  }
}
