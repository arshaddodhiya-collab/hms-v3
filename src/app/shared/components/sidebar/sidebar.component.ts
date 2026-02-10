import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { MENU_CONFIG } from '../../../core/config/menu.config';
import { filter } from 'rxjs/operators';
import { MenuItem } from '../../../core/models/menu.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() visible: boolean = false; // For mobile toggle
  menuItems: MenuItem[] = [];
  currentRoute: string = '';

  expandedMenus: { [key: string]: boolean } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.updateExpandedState();
      });
  }

  ngOnInit() {
    // Subscribe to user changes to reload menu when permissions are available
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.loadMenu();
      }
    });
    this.updateExpandedState();
  }

  loadMenu() {
    this.menuItems = this.filterMenu(MENU_CONFIG);
  }

  private filterMenu(items: MenuItem[]): MenuItem[] {
    return items
      .filter((item) => this.authService.hasPermission(item.permission || ''))
      .map((item) => {
        if (item.items) {
          return { ...item, items: this.filterMenu(item.items) };
        }
        return item;
      })
      .filter((item) => !item.items || item.items.length > 0); // Hide groups with no visible children
  }

  toggleMenu(label: string) {
    this.expandedMenus[label] = !this.expandedMenus[label];
  }

  isExpanded(label: string): boolean {
    return !!this.expandedMenus[label];
  }

  updateExpandedState() {
    // Auto expand parent if child is active
    this.menuItems.forEach((item) => {
      if (item.items) {
        if (
          item.items.some((child: MenuItem) => this.isActive(child.route || ''))
        ) {
          this.expandedMenus[item.label] = true;
        }
      }
    });
  }

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return this.currentRoute.includes(route);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
