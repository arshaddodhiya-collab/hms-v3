import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LabService, LabRequest } from '../../services/lab.service';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-lab-request-list',
  templateUrl: './lab-request-list.component.html',
  styleUrls: ['./lab-request-list.component.scss'],
})
export class LabRequestListComponent implements OnInit {
  requests: LabRequest[] = [];
  permissions = PERMISSIONS;

  constructor(
    private labService: LabService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.labService.getRequests().subscribe((data) => {
      this.requests = data;
    });
  }

  getSeverity(
    priority: string,
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (priority) {
      case 'EMERGENCY':
        return 'danger';
      case 'URGENT':
        return 'warning';
      case 'ROUTINE':
        return 'info';
      default:
        return 'info';
    }
  }

  getStatusSeverity(
    status: string,
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'warning';
      case 'PENDING':
        return 'secondary';
      default:
        return 'info';
    }
  }

  enterResults(id: string): void {
    this.router.navigate(['/lab/entry', id]);
  }

  viewReport(id: string): void {
    this.router.navigate(['/lab/view', id]);
  }
}
