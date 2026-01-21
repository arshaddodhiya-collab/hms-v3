import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  template: `
    <div
      class="flex flex-column align-items-center justify-content-center h-screen surface-ground"
    >
      <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">Welcome to HMS</div>
          <span class="text-600 font-medium line-height-3"
            >Login to your account</span
          >
        </div>

        <form (ngSubmit)="login()">
          <label for="username" class="block text-900 font-medium mb-2"
            >Username</label
          >
          <input
            id="username"
            name="username"
            type="text"
            pInputText
            class="w-full mb-3"
            [(ngModel)]="username"
            placeholder="Username"
          />

          <label for="password" class="block text-900 font-medium mb-2"
            >Password</label
          >
          <input
            id="password"
            name="password"
            type="password"
            pInputText
            class="w-full mb-3"
            [(ngModel)]="password"
            placeholder="Password"
          />

          <button
            pButton
            pRipple
            type="submit"
            label="Sign In"
            icon="pi pi-user"
            class="w-full"
            [loading]="loading"
          ></button>

          <div *ngIf="error" class="text-red-500 mt-2 text-center">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  `,
  providers: [MessageService],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    this.error = '';
    if (this.username && this.password) {
      this.loading = true;
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          this.loading = false;
          // Redirect based on role helper from service
          const redirectUrl = this.authService.getRedirectUrl();
          this.router.navigate([redirectUrl]);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Invalid username or password';
        },
      });
    }
  }
}
