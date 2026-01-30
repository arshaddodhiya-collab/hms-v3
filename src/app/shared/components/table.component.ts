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
      [rowsPerPageOptions]="rowsPerPageOptions"
      [loading]="loading"
      [globalFilterFields]="globalFilterFields"
      [styleClass]="styleClass"
      [responsiveLayout]="responsiveLayout"
      [selection]="selection"
      (selectionChange)="selectionChange.emit($event)"
      [selectionMode]="selectionMode"
      [rowHover]="true"
      #dt
    >
      <ng-template pTemplate="caption">
        <div
          class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-2"
        >
          <div class="flex align-items-center">
            <ng-content select="[caption]"></ng-content>
          </div>
          <span class="p-input-icon-left w-full md:w-auto" *ngIf="showSearch">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              (input)="dt.filterGlobal($any($event.target).value, 'contains')"
              placeholder="Search keyword"
              class="w-full md:w-auto"
            />
          </span>
        </div>
      </ng-template>
      <ng-template pTemplate="header" let-columns>
        <tr>
          <th *ngIf="selectionMode === 'multiple'" style="width: 4rem">
            <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
          </th>
          <th *ngFor="let col of columns" [pSortableColumn]="col.field">
            {{ col.header }}
            <p-sortIcon [field]="col.field"></p-sortIcon>
          </th>
          <th *ngIf="actionsTemplate">Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row let-columns="columns">
        <tr>
          <td *ngIf="selectionMode === 'multiple'">
            <p-tableCheckbox [value]="row"></p-tableCheckbox>
          </td>
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
            [attr.colspan]="
              columns.length +
              (actionsTemplate ? 1 : 0) +
              (selectionMode === 'multiple' ? 1 : 0)
            "
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
  @Input() rowsPerPageOptions: number[] = [10, 20, 50];
  @Input() paginator = true;
  @Input() loading = false;
  @Input() globalFilterFields: string[] = [];
  @Input() showSearch = true;
  @Input() actionsTemplate: TemplateRef<any> | null = null;
  @Input() styleClass =
    'p-datatable-sm p-datatable-gridlines p-datatable-responsive-min';
  @Input() responsiveLayout = 'scroll';
  @Input() selection: any;
  @Output() selectionChange = new EventEmitter<any>();
  @Input() selectionMode: 'single' | 'multiple' | null = null;
}
