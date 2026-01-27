import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MockAuthService } from '../../../../core/services/mock-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private authService: MockAuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  onLogin() {
    if (this.username && this.password) {
      const success = this.authService.login(this.username, this.password);
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter username and password',
      });
    }
  }
}
