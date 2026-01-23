import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  template: `
    <p-table
      [value]="data"
      [tableStyle]="{ 'min-width': '50rem' }"
      styleClass="p-datatable-sm p-datatable-gridlines"
    >
      <ng-template pTemplate="header">
        <tr>
          <th *ngFor="let col of columns" [pSortableColumn]="col.field">
            {{ col.header }}
            <p-sortIcon [field]="col.field"></p-sortIcon>
          </th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row>
        <tr>
          <td *ngFor="let col of columns">{{ row[col.field] }}</td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="columns.length" class="text-center p-4">
            No records found.
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class TableComponent {
  @Input() columns: { field: string; header: string }[] = [];
  @Input() data: any[] = [];
}
