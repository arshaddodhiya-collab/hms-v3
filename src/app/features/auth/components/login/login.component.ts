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
import { AuthService } from '../../services/auth.service';
import { VoiceCommandService } from '../../../voice-navigation/services/voice-command.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
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
        // zoneRun not strictly needed if voice service handles zone, but safe.
        this.onLogin();
      },
    });
  }

  ngOnDestroy() {
    this.voiceCommandService.unregisterCommand('login-submit');
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password } = this.loginForm.value;

      this.authService.login({ username, password }).subscribe({
        next: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login Successful',
          });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Invalid username or password';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid username or password',
          });
          console.error('Login error', err);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter username and password',
      });
    }
  }
}
