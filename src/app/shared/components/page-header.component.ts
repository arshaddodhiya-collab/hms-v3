import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div
      class="flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-1 border-round"
    >
      <h1 class="text-xl font-bold m-0 text-900">{{ title }}</h1>
      <div class="flex gap-2">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title: string = '';
}
