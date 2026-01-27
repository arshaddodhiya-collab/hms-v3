import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit {
  patients = [
    { id: 1, name: 'John Doe', age: 30, gender: 'Male', contact: '1234567890' },
    {
      id: 2,
      name: 'Jane Smith',
      age: 25,
      gender: 'Female',
      contact: '0987654321',
    },
  ];

  displayDialog: boolean = false;
  patient: any = {};
  submitted: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  openNew() {
    this.patient = {};
    this.submitted = false;
    this.displayDialog = true;
  }

  editPatient(patient: any) {
    this.patient = { ...patient };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.submitted = false;
  }

  savePatient() {
    this.submitted = true;

    if (this.patient.name?.trim()) {
      if (this.patient.id) {
        // Update
        const index = this.patients.findIndex((x) => x.id === this.patient.id);
        this.patients[index] = this.patient;
      } else {
        // Create
        this.patient.id = this.patients.length + 1; // Simple ID generation
        this.patients.push(this.patient);
      }

      this.patients = [...this.patients];
      this.displayDialog = false;
      this.patient = {};
    }
  }
}
