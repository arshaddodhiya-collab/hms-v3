import {
  Component,
  OnInit,
  Inject,
  LOCALE_ID,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { MessageService } from 'primeng/api';
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent
  extends BaseCrudComponent<any>
  implements OnInit, AfterViewInit
{
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  permissions = PERMISSIONS;

  submitted: boolean = false;
  statuses: any[] = [
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  cols: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'patientName', header: 'Patient' },
    { field: 'doctorName', header: 'Doctor' },
    { field: 'date', header: 'Date' },
    { field: 'time', header: 'Time' },
    { field: 'status', header: 'Status' },
  ];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private messageService: MessageService,
  ) {
    super();
  }

  override ngOnInit(): void {
    this.refreshData();
  }

  override refreshData() {
    this.data = [
      {
        id: 101,
        patientName: 'John Doe',
        doctorName: 'Dr. Smith',
        date: '2023-10-25',
        time: '10:00 AM',
        status: 'Confirmed',
      },
      {
        id: 102,
        patientName: 'Jane Smith',
        doctorName: 'Dr. Jones',
        date: '2023-10-26',
        time: '02:00 PM',
        status: 'Pending',
      },
    ];
  }

  ngAfterViewInit() {
    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) {
      statusCol.template = this.statusTemplate;
    }
  }

  override openNew(header: string = 'New Appointment') {
    this.selectedItem = {};
    this.submitted = false;
    this.dialogHeader = header;
    this.displayDialog = true;
  }

  override editItem(appointment: any, header: string = 'Edit Appointment') {
    this.selectedItem = { ...appointment };
    this.dialogHeader = header;
    if (this.selectedItem.time) {
      const today = new Date();
      const [time, period] = this.selectedItem.time.split(' ');
      if (time && period) {
        const [hours, minutes] = time.split(':');
        let h = parseInt(hours);
        const m = parseInt(minutes);

        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;

        today.setHours(h, m, 0);
        this.selectedItem.time = today;
      }
    }
    this.displayDialog = true;
  }

  override hideDialog() {
    this.displayDialog = false;
    this.submitted = false;
    this.selectedItem = null;
  }

  override onSave(item: any) {
    this.submitted = true;
    // item is passed from template or we use this.selectedItem
    // To be safe, rely on this.selectedItem since it is bound to ngModel
    const appt = this.selectedItem;

    if (appt.patientName?.trim()) {
      if (appt.time instanceof Date) {
        appt.time = formatDate(appt.time, 'shortTime', this.locale);
      }

      if (appt.id) {
        // Update
        const index = this.data.findIndex((x) => x.id === appt.id);
        this.data[index] = appt;
      } else {
        // Create
        appt.id = Math.floor(Math.random() * 1000);
        appt.status = appt.status || 'Pending';
        this.data.push(appt);
      }

      this.data = [...this.data];
      this.hideDialog();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Appointment Saved',
      });
    }
  }
}
