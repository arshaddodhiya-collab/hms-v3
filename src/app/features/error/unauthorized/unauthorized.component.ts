import { Component } from '@angular/core';
import { Location as NgLocation } from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
})
export class UnauthorizedComponent {
  constructor(private location: NgLocation) {}

  goBack(): void {
    this.location.back();
  }
}
