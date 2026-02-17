import { Component, Input } from '@angular/core';
import { EncounterResponse } from '../../../../core/models/encounter.model';

@Component({
  selector: 'app-consultation-history',
  templateUrl: './consultation-history.component.html',
  styleUrls: ['./consultation-history.component.scss'],
})
export class ConsultationHistoryComponent {
  @Input() encounters: EncounterResponse[] = [];

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
      case 'COMPLETED':
        return 'success';
      case 'Scheduled':
      case 'CHRONIC':
      case 'TRIAGE':
        return 'info';
      case 'Cancelled':
      case 'CANCELLED':
        return 'danger';
      case 'Ongoing':
      case 'ONGOING':
      case 'IN_PROGRESS':
        return 'warning';
      default:
        return 'info';
    }
  }
}
