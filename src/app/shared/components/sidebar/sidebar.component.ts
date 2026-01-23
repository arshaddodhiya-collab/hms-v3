import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { MENU_CONFIG } from '../../../core/config/menu.config';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() visible: boolean = false; // For mobile toggle
  menuItems: any[] = [];
  currentRoute: string = '';

  constructor(
    private authService: MockAuthService,
    private router: Router,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    this.menuItems = MENU_CONFIG.filter((item) =>
      this.authService.hasPermission(item.permission),
    );
  }

  isActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}
