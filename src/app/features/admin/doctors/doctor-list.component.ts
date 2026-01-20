import { Component, OnInit } from '@angular/core';
import { AdminService, Doctor } from '../services/admin.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss'],
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  doctor: Doctor = {} as Doctor;
  doctorDialog: boolean = false;
  statuses: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.statuses = [
      { label: 'Available', value: 'Available' },
      { label: 'On Leave', value: 'On Leave' },
    ];
    this.loadDoctors();
  }

  loadDoctors() {
    this.adminService.getDoctors().subscribe((data) => (this.doctors = data));
  }

  openNew() {
    this.doctor = {} as Doctor;
    this.doctorDialog = true;
  }

  editDoctor(doctor: Doctor) {
    this.doctor = { ...doctor };
    this.doctorDialog = true;
  }

  hideDialog() {
    this.doctorDialog = false;
  }

  saveDoctor() {
    if (this.doctor.name?.trim()) {
      if (this.doctor.id) {
        this.adminService.updateDoctor(this.doctor).subscribe(() => {
          this.loadDoctors();
          this.doctorDialog = false;
          this.doctor = {} as Doctor;
        });
      } else {
        this.adminService.addDoctor(this.doctor).subscribe(() => {
          this.loadDoctors();
          this.doctorDialog = false;
          this.doctor = {} as Doctor;
        });
      }
    }
  }

  deleteDoctor(doctor: Doctor) {
    // In a real app, we would call a service method to delete.
    // For now, we'll just filter it out locally to simulate deletion.
    this.doctors = this.doctors.filter((d) => d.id !== doctor.id);
  }
}
