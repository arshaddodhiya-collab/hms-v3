import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VoiceRecognitionService } from './voice-recognition.service';
import { MockAuthService } from './mock-auth.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import Fuse from 'fuse.js';

interface VoiceCommand {
  id: string;
  phrases: string[];
  action: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class VoiceCommandService {
  private subscription: Subscription = new Subscription();
  private fuse: Fuse<VoiceCommand> | null = null;
  private commands: VoiceCommand[] = [];

  constructor(
    private voiceService: VoiceRecognitionService,
    private authService: MockAuthService,
    private router: Router,
    private location: Location,
  ) {
    this.initCommands();
    this.initFuse();
  }

  private initCommands() {
    this.commands = [
      // Navigation
      {
        id: 'nav-dashboard',
        phrases: ['Dashboard', 'Home', 'Dash board', 'Go to dashboard'],
        action: () => this.router.navigate(['/dashboard']),
      },
      {
        id: 'nav-patients',
        phrases: ['Patients', 'Patient List', 'Pay shunts', 'Go to patients'],
        action: () => this.router.navigate(['/patients']),
      },
      {
        id: 'nav-appointments',
        phrases: [
          'Appointments',
          'Appointment List',
          'A point ments',
          'Go to appointments',
        ],
        action: () => this.router.navigate(['/appointments']),
      },
      {
        id: 'nav-billing',
        phrases: ['Billing', 'Bill ing', 'Go to billing'],
        action: () => this.router.navigate(['/billing']),
      },
      {
        id: 'nav-triage',
        phrases: ['Triage', 'Tree azh', 'Go to triage'],
        action: () => this.router.navigate(['/triage']),
      },
      {
        id: 'nav-admin',
        phrases: ['Admin', 'Administrator', 'Add min', 'Go to admin'],
        action: () => this.router.navigate(['/admin']),
      },
      {
        id: 'nav-users',
        phrases: ['Users', 'User List', 'Use ars', 'Go to users'],
        action: () => this.router.navigate(['/admin/users']),
      },
      {
        id: 'nav-departments',
        phrases: [
          'Departments',
          'Department List',
          'Deep art ments',
          'Go to departments',
        ],
        action: () => this.router.navigate(['/admin/departments']),
      },
      {
        id: 'nav-lab',
        phrases: ['Lab', 'Laboratory', 'Go to lab'],
        action: () => this.router.navigate(['/lab']),
      },
      {
        id: 'nav-consultation',
        phrases: ['Consultation', 'Consult', 'Go to consultation'],
        action: () => this.router.navigate(['/consultation']),
      },

      // Global Actions
      {
        id: 'action-logout',
        phrases: ['Logout', 'Log out', 'Sign out', 'Log me out', 'Low gout'],
        action: () => this.authService.logout(),
      },
      {
        id: 'action-back',
        phrases: ['Go back', 'Navigate back', 'Back'],
        action: () => this.location.back(),
      },
      {
        id: 'action-scroll-down',
        phrases: ['Scroll down', 'Page down', 'Down'],
        action: () => window.scrollBy({ top: 500, behavior: 'smooth' }),
      },
      {
        id: 'action-scroll-up',
        phrases: ['Scroll up', 'Page up', 'Up'],
        action: () => window.scrollBy({ top: -500, behavior: 'smooth' }),
      },
      {
        id: 'action-login',
        phrases: ['Login', 'Log in', 'Sign in', 'Low gin'],
        action: () => this.router.navigate(['/auth/login']),
      },
    ];
  }

  private initFuse() {
    this.fuse = new Fuse(this.commands, {
      keys: ['phrases'],
      threshold: 0.4, // 0.0 = exact match, 1.0 = match anything
      includeScore: true,
      ignoreLocation: true,
    });
  }

  private lastExecutionTime = 0;
  private lastExecutedCommand = '';

  init(): void {
    this.subscription.add(
      this.voiceService.result$.subscribe((result) => {
        if (result && result.text) {
          this.processCommand(result.text, result.isFinal);
        }
      }),
    );
  }

  private processCommand(command: string, isFinal: boolean): void {
    // console.log(`Processing: "${command}" (Final: ${isFinal})`);

    if (!this.fuse) return;

    // Ignore Focus/Type commands here (handled by directive)
    if (
      command.toLowerCase().startsWith('focus ') ||
      command.toLowerCase().startsWith('type ') ||
      command.toLowerCase().startsWith('select ')
    ) {
      return;
    }

    // Debounce: Don't execute same command twice within 2 seconds
    if (Date.now() - this.lastExecutionTime < 2000) {
      // checks if it's the SAME command
      // actually, we might want to allow "Scroll Down" multiple times?
      // For now, strict debounce to avoid "Dashboard... Dashboard" double nav.
      return;
    }

    const result = this.fuse.search(command);

    if (result.length > 0) {
      const bestMatch = result[0];
      const score = bestMatch.score || 1;

      // Thresholds
      // Final result: Loose threshold (0.4)
      // Interim result: Strict threshold (0.15) to ensure we don't jump prematurely
      const limit = isFinal ? 0.4 : 0.15;

      if (score < limit) {
        console.log(
          `Executing "${bestMatch.item.id}" (Score: ${score.toFixed(3)}, Final: ${isFinal})`,
        );
        bestMatch.item.action();
        this.lastExecutionTime = Date.now();
        this.lastExecutedCommand = bestMatch.item.id;
      }
    }
  }

  destroy(): void {
    this.subscription.unsubscribe();
  }
}
