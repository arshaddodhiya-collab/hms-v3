import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IpdFacade } from '../../facades/ipd.facade';

@Component({
  selector: 'app-admission-list',
  templateUrl: './admission-list.component.html',
  styleUrl: './admission-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionListComponent implements OnInit {
  cols: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'patientName', header: 'Patient Name' },
    { field: 'wardName', header: 'Ward' },
    { field: 'bedNumber', header: 'Bed' },
    { field: 'doctorName', header: 'Doctor' },
    { field: 'status', header: 'Status' },
  ];

  constructor(public facade: IpdFacade) {}

  ngOnInit(): void {
    this.facade.loadAdmissions();
  }
}
