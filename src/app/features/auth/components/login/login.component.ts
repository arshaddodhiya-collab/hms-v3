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
    if (this.username && this.password) {
      const success = this.authService.login(this.username, this.password);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Invalid username or password';
      }
    } else {
      this.error = 'Please enter username and password';
    }
  }
}
