import { Injectable } from '@angular/core';

export interface ErrorDetails {
  message: string;
  status: number;
  timestamp: Date;
  url?: string;
  stackTrace?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorStateService {
  private errorDetails: ErrorDetails | null = null;

  setError(details: ErrorDetails): void {
    this.errorDetails = details;
  }

  getError(): ErrorDetails | null {
    return this.errorDetails;
  }

  clearError(): void {
    this.errorDetails = null;
  }
}
