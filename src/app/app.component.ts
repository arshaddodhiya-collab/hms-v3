import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isMobile = false;
  sidebarVisible = false;
  isAuthRoute = false;

  constructor(
    private authService: AuthService,
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
      .subscribe((event: any) => {
        this.isAuthRoute =
          event.url.includes('/auth') || event.url.includes('/error');
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

  get showLayout(): boolean {
    return this.isLoggedIn && !this.isAuthRoute;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
