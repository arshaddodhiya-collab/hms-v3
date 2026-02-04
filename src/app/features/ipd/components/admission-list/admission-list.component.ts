import { Component, OnInit } from '@angular/core';
import {
  Admission,
  AdmissionStatus,
} from '../../../../core/models/patient.model';
import { IpdService } from '../../../../core/services/ipd.service';

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
  loading = false;

  constructor(private ipdService: IpdService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.loading = true;
    this.ipdService.getAdmissions().subscribe((data) => {
      this.data = data;
      this.loading = false;
    });
  }
}
