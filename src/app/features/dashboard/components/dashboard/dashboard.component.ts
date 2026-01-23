import { Component, OnInit } from '@angular/core';
import { MockAuthService } from '../../../../core/services/mock-auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  username: string = '';

  constructor(private authService: MockAuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userRole = user.role;
      this.username = user.username;
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
