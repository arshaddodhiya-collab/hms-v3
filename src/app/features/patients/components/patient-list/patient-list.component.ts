import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

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
  selectedPatient: any = null;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  openNew() {
    this.selectedPatient = null;
    this.displayDialog = true;
  }

  editPatient(patient: any) {
    this.selectedPatient = { ...patient };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.selectedPatient = null;
  }

  savePatient(patientData: any) {
    if (patientData.id) {
      // Update
      const index = this.patients.findIndex((x) => x.id === patientData.id);
      this.patients[index] = patientData;
    } else {
      // Create
      patientData.id = this.patients.length + 1;
      this.patients.push(patientData);
    }

    this.patients = [...this.patients];
    this.hideDialog();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Patient Saved',
    });
  }
}
