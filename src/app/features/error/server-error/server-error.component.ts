import { Component, OnInit } from '@angular/core';
import {
  ErrorStateService,
  ErrorDetails,
} from '../../../core/services/error-state.service';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
})
export class ServerErrorComponent implements OnInit {
  errorDetails: ErrorDetails | null = null;

  constructor(private errorStateService: ErrorStateService) {}

  ngOnInit(): void {
    this.errorDetails = this.errorStateService.getError();
  }

  get errorMessage(): string {
    return (
      this.errorDetails?.message ||
      'Something went wrong on our side. Please try again later.'
    );
  }

  get errorStatus(): number | null {
    return this.errorDetails?.status || null;
  }

  get errorTimestamp(): Date | null {
    return this.errorDetails?.timestamp || null;
  }
}
