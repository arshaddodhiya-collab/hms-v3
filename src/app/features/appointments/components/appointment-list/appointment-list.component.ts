import {
  Component,
  OnInit,
  Inject,
  LOCALE_ID,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { TableColumn } from '../../../../shared/models/table.model';
import { MessageService } from 'primeng/api';
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { Visit } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent
  extends BaseCrudComponent<Visit>
  implements OnInit, AfterViewInit
{
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<{
    $implicit: unknown;
    row: Visit;
  }>;

  permissions = PERMISSIONS;

  submitted: boolean = false;
  statuses: any[] = [
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  cols: TableColumn<Visit>[] = [
    { field: 'id', header: 'ID' },
    { field: 'patientName', header: 'Patient' },
    { field: 'doctorName', header: 'Doctor' },
    { field: 'appointmentTime', header: 'Time' }, // Updated field name
    { field: 'status', header: 'Status' },
  ];

  // Temporary properties for form binding
  appointmentDate: Date | null = null;
  appointmentTime: Date | null = null;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private messageService: MessageService,
    private appointmentService: AppointmentService,
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
    this.selectedItem = {} as Visit;
    this.appointmentDate = null;
    this.appointmentTime = null;
    this.submitted = false;
    this.dialogHeader = header;
    this.displayDialog = true;
  }

  override editItem(appointment: Visit, header: string = 'Edit Appointment') {
    this.selectedItem = { ...appointment };
    // Initialize separate date/time from the single appointmentTime
    if (appointment.appointmentTime) {
      const dateTime = new Date(appointment.appointmentTime);
      this.appointmentDate = dateTime;
      this.appointmentTime = dateTime;
    } else {
      this.appointmentDate = null;
      this.appointmentTime = null;
    }

    this.dialogHeader = header;
    this.displayDialog = true;
  }

  override hideDialog() {
    this.displayDialog = false;
    this.submitted = false;
    this.selectedItem = null;
    this.appointmentDate = null;
    this.appointmentTime = null;
  }

  override onSave(_: Visit | null) {
    this.submitted = true;
    const appt = this.selectedItem;

    if (appt && appt.patientName) {
      // Combine date and time
      if (this.appointmentDate) {
        const finalDate = new Date(this.appointmentDate);
        if (this.appointmentTime) {
          finalDate.setHours(this.appointmentTime.getHours());
          finalDate.setMinutes(this.appointmentTime.getMinutes());
        }
        appt.appointmentTime = finalDate;
      }

      // Create only for now as service supports create
      if (!appt.id) {
        this.appointmentService.createAppointment(appt).subscribe(() => {
          this.refreshData();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Appointment Saved',
          });
        });
      } else {
        // Mock update since service doesn't have full update yet, just status
        // In real app we would add updateAppointment(appt)
        this.hideDialog();
      }
    }
  }
}
