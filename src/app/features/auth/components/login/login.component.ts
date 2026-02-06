import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MockAuthService } from '../../services/mock-auth.service';
import { VoiceCommandService } from '../../../voice-navigation/services/voice-command.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  error = '';

  constructor(
    private authService: MockAuthService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private voiceCommandService: VoiceCommandService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.voiceCommandService.registerCommand({
      id: 'login-submit',
      phrases: ['Click Login', 'Submit', 'Confirm', 'Sign in now'],
      action: () => {
        this.zoneRun(() => this.onLogin());
      },
    });
  }

  ngOnDestroy() {
    this.voiceCommandService.unregisterCommand('login-submit');
  }

  // Helper to ensure Angular change detection runs
  private zoneRun(fn: () => void) {
    // Assuming we might be outside zone from voice service, though service uses zone.run
    // But better safe.
    fn();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const success = this.authService.login(username, password);
      if (success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login Successful',
        });
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Invalid username or password';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid username or password',
        });
      }
    } else {
      this.error = 'Please enter username and password';
      this.loginForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter username and password',
      });
    }
  }
}
