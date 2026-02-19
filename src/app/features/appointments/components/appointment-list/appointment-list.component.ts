import {
  Component,
  OnInit,
  Inject,
  LOCALE_ID,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn } from '../../../../shared/models/table.model';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AppointmentResponse } from '../../models/appointment.model';
import { AppointmentFacade } from '../../facades/appointment.facade';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentListComponent implements OnInit, AfterViewInit {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<{
    $implicit: unknown;
    row: AppointmentResponse;
  }>;

  permissions = PERMISSIONS;

  statuses: any[] = [
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Checked In', value: 'CHECKED_IN' },
  ];

  cols: TableColumn<AppointmentResponse>[] = [
    { field: 'id', header: 'ID' },
    { field: 'patientName', header: 'Patient' },
    { field: 'doctorName', header: 'Doctor' },
    { field: 'startDateTime', header: 'Start Time' },
    { field: 'status', header: 'Status' },
    { field: 'type', header: 'Type' },
  ];

  constructor(
    public facade: AppointmentFacade,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.facade.loadAll();
  }

  ngAfterViewInit() {
    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) {
      statusCol.template = this.statusTemplate;
    }
  }

  openNew() {
    this.router.navigate(['appointments/create']);
  }

  editItem(appointment: AppointmentResponse) {
    this.router.navigate(['appointments/edit', appointment.id]);
  }

  onCheckIn(appointment: AppointmentResponse) {
    this.facade.checkIn(appointment.id);
  }
}
