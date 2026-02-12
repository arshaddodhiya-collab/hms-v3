import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorStateService } from '../services/error-state.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private messageService: MessageService,
    private errorStateService: ErrorStateService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';

        // Skip error handling for /auth/me endpoint (used during initial load)
        if (error.url?.includes('/auth/me')) {
          return throwError(() => error);
        }

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
          this.messageService.add({
            severity: 'error',
            summary: 'Client Error',
            detail: errorMessage,
          });
        } else {
          // Server-side error
          if (error.status === 401) {
            // Let the auth interceptor (if any) or specific logic handle 401 logout,
            // or just show a message/redirect.
            // For now, 401 usually means token expired or not logged in.
            // We can redirect to login or show unauthorized if it's a permissions thing (which is usually 403).
            // Plan said 403 -> Unauthorized component.
          } else if (error.status === 403) {
            this.router.navigate(['/error/unauthorized']);
          } else if (error.status === 404) {
            this.router.navigate(['/error/not-found']);
          } else if (error.status === 500) {
            // Store error details before redirecting
            this.errorStateService.setError({
              message:
                error.error?.message ||
                error.message ||
                'Internal Server Error',
              status: error.status,
              timestamp: new Date(),
              url: error.url || undefined,
            });
            this.router.navigate(['/error/server-error']);
          } else {
            // Other errors (400, etc)
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMessage,
            });
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
