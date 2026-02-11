import {
  Component,
  OnInit,
  Inject,
  LOCALE_ID,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router'; // Added Router
import { TableColumn } from '../../../../shared/models/table.model';
import { MessageService } from 'primeng/api';
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentResponse } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent
  extends BaseCrudComponent<AppointmentResponse>
  implements OnInit, AfterViewInit
{
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<{
    $implicit: unknown;
    row: AppointmentResponse;
  }>;

  permissions = PERMISSIONS;

  submitted: boolean = false;
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
    @Inject(LOCALE_ID) private locale: string,
    private messageService: MessageService,
    private appointmentService: AppointmentService,
    private router: Router,
  ) {
    super();
  }

  override ngOnInit(): void {
    this.refreshData();
  }

  override refreshData() {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load appointments',
        });
      },
    });
  }

  ngAfterViewInit() {
    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) {
      statusCol.template = this.statusTemplate;
    }
  }

  override openNew(header: string = 'New Appointment') {
    this.router.navigate(['appointments/create']);
  }

  override editItem(
    appointment: AppointmentResponse,
    header: string = 'Edit Appointment',
  ) {
    this.router.navigate(['appointments/edit', appointment.id]);
  }

  override hideDialog() {
    this.displayDialog = false;
  }

  override onSave(_: AppointmentResponse | null) {
    // No-op
  }
}
