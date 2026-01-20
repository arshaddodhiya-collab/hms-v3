import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  stats$!: Observable<any>;
  recentActivities$!: Observable<any[]>;
  doctors$!: Observable<any[]>;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.stats$ = this.adminService.getDashboardStats();
    this.recentActivities$ = this.adminService.getRecentActivities();
    this.doctors$ = this.adminService.getDoctors();
  }
}
