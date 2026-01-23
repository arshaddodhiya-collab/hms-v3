import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  ) {}

  onLogin() {
    // Simulating a basic check
    if (this.username && this.password) {
      this.authService.login();
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Please enter valid credentials';
    }
  }
}
