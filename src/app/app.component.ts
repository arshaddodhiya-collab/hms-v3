import { Component, OnInit } from '@angular/core';
import { MockAuthService } from './core/services/mock-auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isMobile = false;
  sidebarVisible = false;

  constructor(
    private authService: MockAuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result: { matches: boolean }) => {
        this.isMobile = result.matches;
        if (!this.isMobile) {
          this.sidebarVisible = true; // Always show on desktop
        } else {
          this.sidebarVisible = false;
        }
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.sidebarVisible = false; // Close on route change on mobile
        }
      });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
