import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentFacade } from '../../facades/appointment.facade';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentViewComponent implements OnInit {
  events: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public facade: AppointmentFacade,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.loadById(+id);
    }
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
      case 'Confirmed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'Scheduled':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'info';
    }
  }
}
