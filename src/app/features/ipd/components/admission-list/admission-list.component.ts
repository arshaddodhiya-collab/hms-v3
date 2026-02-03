import { Component, OnInit } from '@angular/core';
import {
  Admission,
  AdmissionStatus,
} from '../../../../core/models/patient.model';

@Component({
  selector: 'app-admission-list',
  templateUrl: './admission-list.component.html',
  styleUrl: './admission-list.component.scss',
})
export class AdmissionListComponent implements OnInit {
  cols: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'patientName', header: 'Patient Name' },
    { field: 'ward', header: 'Ward' },
    { field: 'bedNumber', header: 'Bed' },
    { field: 'doctorName', header: 'Doctor' },
    { field: 'status', header: 'Status' },
  ];

  data: Admission[] = [];

  constructor() {}

  ngOnInit(): void {
    this.data = [
      {
        id: 1001,
        patientId: 1,
        patientName: 'John Doe',
        admissionDate: new Date(),
        ward: 'General Ward',
        bedNumber: 'G-101',
        doctorName: 'Dr. Smith',
        status: AdmissionStatus.ADMITTED,
        diagnosis: 'Viral Fever',
      },
      {
        id: 1002,
        patientId: 2,
        patientName: 'Jane Smith',
        admissionDate: new Date(),
        ward: 'ICU',
        bedNumber: 'ICU-1',
        doctorName: 'Dr. House',
        status: AdmissionStatus.ADMITTED,
        diagnosis: 'Arrhythmia',
      },
    ];
  }
}
