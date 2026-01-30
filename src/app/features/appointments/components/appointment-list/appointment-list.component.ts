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

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit, AfterViewInit {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  appointments = [
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

  displayDialog: boolean = false;
  appointment: any = {};
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
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) {
      statusCol.template = this.statusTemplate;
    }
  }

  openNew() {
    this.appointment = {};
    this.submitted = false;
    this.displayDialog = true;
  }

  editAppointment(appointment: any) {
    this.appointment = { ...appointment };
    if (this.appointment.time) {
      const today = new Date();
      // Simple parsing (assuming '10:00 AM' format)
      // For robustness in real app, use Date parsing library or moment
      // Keeping existing logic
      const [time, period] = this.appointment.time.split(' ');
      if (time && period) {
        let [hours, minutes] = time.split(':');
        let h = parseInt(hours);
        const m = parseInt(minutes);

        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;

        today.setHours(h, m, 0);
        this.appointment.time = today;
      }
    }
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.submitted = false;
  }

  saveAppointment() {
    this.submitted = true;

    if (this.appointment.patientName?.trim()) {
      if (this.appointment.time instanceof Date) {
        this.appointment.time = formatDate(
          this.appointment.time,
          'shortTime',
          this.locale,
        );
      }

      if (this.appointment.id) {
        // Update
        const index = this.appointments.findIndex(
          (x) => x.id === this.appointment.id,
        );
        this.appointments[index] = this.appointment;
      } else {
        // Create
        this.appointment.id = Math.floor(Math.random() * 1000);
        this.appointment.status = this.appointment.status || 'Pending';
        this.appointments.push(this.appointment);
      }

      this.appointments = [...this.appointments];
      this.displayDialog = false;
      this.appointment = {};
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Appointment Saved',
      });
    }
  }
}
