import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-table',
  template: `
    <p-table
      [value]="data"
      [columns]="columns"
      [rows]="rows"
      [paginator]="paginator"
      [globalFilterFields]="globalFilterFields"
      [tableStyle]="{ 'min-width': '50rem' }"
      styleClass="p-datatable-sm p-datatable-gridlines"
      #dt
    >
      <ng-template pTemplate="caption">
        <div class="flex">
          <ng-content select="[caption]"></ng-content>
          <span class="p-input-icon-left ml-auto" *ngIf="showSearch">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              (input)="dt.filterGlobal($any($event.target).value, 'contains')"
              placeholder="Search keyword"
            />
          </span>
        </div>
      </ng-template>
      <ng-template pTemplate="header" let-columns>
        <tr>
          <th *ngFor="let col of columns" [pSortableColumn]="col.field">
            {{ col.header }}
            <p-sortIcon [field]="col.field"></p-sortIcon>
          </th>
          <th *ngIf="actionsTemplate">Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row let-columns="columns">
        <tr>
          <td *ngFor="let col of columns">
            <ng-container *ngIf="col.template; else defaultCell">
              <ng-container
                *ngTemplateOutlet="
                  col.template;
                  context: { $implicit: row[col.field], row: row }
                "
              ></ng-container>
            </ng-container>
            <ng-template #defaultCell>
              {{ row[col.field] }}
            </ng-template>
          </td>
          <td *ngIf="actionsTemplate">
            <ng-container
              *ngTemplateOutlet="actionsTemplate; context: { $implicit: row }"
            ></ng-container>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td
            [attr.colspan]="columns.length + (actionsTemplate ? 1 : 0)"
            class="text-center p-4"
          >
            No records found.
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class TableComponent {
  @Input() columns: {
    field: string;
    header: string;
    template?: TemplateRef<any>;
  }[] = [];
  @Input() data: any[] = [];
  @Input() rows = 10;
  @Input() paginator = true;
  @Input() globalFilterFields: string[] = [];
  @Input() showSearch = true;
  @Input() actionsTemplate: TemplateRef<any> | null = null;
}
