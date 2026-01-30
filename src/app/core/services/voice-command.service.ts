import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VoiceRecognitionService } from './voice-recognition.service';
import { MockAuthService } from './mock-auth.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class VoiceCommandService {
  private subscription: Subscription = new Subscription();

  // Define known routes mapping
  private routeMap: { [key: string]: string } = {
    dashboard: '/dashboard',
    patients: '/patients',
    'patient list': '/patients',
    appointments: '/appointments',
    'appointment list': '/appointments',
    billing: '/billing',
    triage: '/triage',
    admin: '/admin',
    users: '/admin/users',
    departments: '/admin/departments',
    lab: '/lab',
    consultation: '/consultation',
  };

  constructor(
    private voiceService: VoiceRecognitionService,
    private authService: MockAuthService,
    private router: Router,
    private location: Location,
  ) {}

  init(): void {
    this.subscription.add(
      this.voiceService.text$.subscribe((text) => {
        if (text) {
          this.processCommand(text);
        }
      }),
    );
  }

  private processCommand(command: string): void {
    const lowerCmd = command.toLowerCase();
    console.log('Voice Command Received:', lowerCmd);

    // Navigation Commands
    if (
      lowerCmd.includes('go to') ||
      lowerCmd.includes('open') ||
      lowerCmd.includes('navigate to')
    ) {
      const target = lowerCmd.replace(/(go to|open|navigate to)\s+/, '').trim();
      this.navigate(target);
    }

    // Back Command
    else if (
      lowerCmd.includes('go back') ||
      lowerCmd.includes('navigate back')
    ) {
      this.location.back();
    }

    // Logout Command
    else if (lowerCmd.includes('logout') || lowerCmd.includes('sign out')) {
      console.log('Triggering Logout...');
      this.authService.logout();
    }

    // Login Navigation
    else if (lowerCmd === 'login' || lowerCmd === 'sign in') {
      this.router.navigate(['/auth/login']);
    }

    // Scroll Commands
    else if (lowerCmd.includes('scroll down')) {
      window.scrollBy({ top: 500, behavior: 'smooth' });
    } else if (lowerCmd.includes('scroll up')) {
      window.scrollBy({ top: -500, behavior: 'smooth' });
    }
  }

  private navigate(target: string): void {
    // Exact match check
    if (this.routeMap[target]) {
      this.router.navigate([this.routeMap[target]]);
      return;
    }

    // Fuzzy / Partial match
    const bestMatch = Object.keys(this.routeMap).find((key) =>
      target.includes(key),
    );
    if (bestMatch) {
      this.router.navigate([this.routeMap[bestMatch]]);
    }
  }

  destroy(): void {
    this.subscription.unsubscribe();
  }
}
