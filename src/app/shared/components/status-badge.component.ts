import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <p-tag [value]="status" [severity]="getSeverity()" [rounded]="true"></p-tag>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  @Input() status: string = '';
  @Input() type: 'success' | 'warning' | 'error' | 'danger' | 'info' = 'info';

  getSeverity(): 'success' | 'warning' | 'danger' | 'info' | undefined {
    switch (this.type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
      case 'danger':
        return 'danger';
      default:
        return 'info';
    }
  }
}
