import { Component, Input } from '@angular/core';
import { MedicalHistory } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss'],
})
export class MedicalHistoryComponent {
  @Input() medicalHistory: MedicalHistory[] = [];

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
      case 'HEALED':
        return 'success';
      case 'Scheduled':
      case 'CHRONIC':
        return 'info';
      case 'Cancelled':
        return 'danger';
      case 'Ongoing':
      case 'ONGOING':
        return 'warning';
      default:
        return 'info';
    }
  }
}
