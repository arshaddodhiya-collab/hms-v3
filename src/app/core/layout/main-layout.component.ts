import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  @Input() menuItems: any[] = [];
  @Input() appTitle: string = 'HMS';
  @Input() userRole: string = 'User';

  sidebarVisible = false;

  constructor(
    private authService: AuthService,
    public router: Router,
  ) {}

  logout() {
    this.authService.logout();
  }
}
