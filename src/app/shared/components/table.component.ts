import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TableColumn } from '../models/table.model';
import { from } from 'rxjs';

@Component({
  selector: 'app-table',
  template: `
    <div class="main-table-wrapper p-4">
      <div
        class="table-container shadow-2 border-round-xl bg-white overflow-x-auto"
      >
        <p-table
          [value]="data"
          [columns]="columns"
          [rows]="rows"
          [paginator]="paginator"
          [paginatorDropdownAppendTo]="'body'"
          [rowsPerPageOptions]="rowsPerPageOptions"
          [loading]="loading"
          [globalFilterFields]="globalFilterFields"
          [styleClass]="styleClass"
          [responsiveLayout]="'scroll'"
          [selection]="selection"
          (selectionChange)="selectionChange.emit($event)"
          [selectionMode]="selectionMode"
          [rowHover]="true"
          [tableStyle]="{ 'min-width': '60rem' }"
          #dt
        >
          <ng-template pTemplate="caption">
            <div
              class="flex flex-wrap align-items-center justify-content-between gap-3 p-3"
            >
              <div class="table-header-title px-2">
                <ng-content select="[caption]"></ng-content>
              </div>

              <div class="p-input-icon-left mr-2" *ngIf="showSearch">
                <i class="pi pi-search text-400"></i>
                <input
                  pInputText
                  type="text"
                  (input)="
                    dt.filterGlobal($any($event.target).value, 'contains')
                  "
                  placeholder="Search records..."
                  class="p-inputtext-md border-round-lg w-full md:w-20rem"
                />
              </div>
            </div>
          </ng-template>

          <ng-template pTemplate="header" let-columns>
            <tr>
              <th
                *ngIf="selectionMode === 'multiple'"
                style="width: 4rem"
                class="checkbox-cell"
              >
                <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
              </th>
              <th
                *ngFor="let col of columns"
                [pSortableColumn]="col.field"
                class="header-cell"
              >
                <div class="flex align-items-center">
                  {{ col.header }}
                  <p-sortIcon
                    [field]="col.field"
                    class="ml-2 opacity-60"
                  ></p-sortIcon>
                </div>
              </th>
              <th *ngIf="actionsTemplate" class="text-center header-cell">
                Actions
              </th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-row let-columns="columns">
            <tr [pSelectableRow]="row" class="table-row">
              <td *ngIf="selectionMode === 'multiple'" class="checkbox-cell">
                <p-tableCheckbox [value]="row"></p-tableCheckbox>
              </td>
              <td *ngFor="let col of columns" class="body-cell">
                <ng-container *ngIf="col.template; else defaultCell">
                  <ng-container
                    *ngTemplateOutlet="
                      col.template;
                      context: { $implicit: row[col.field], row: row }
                    "
                  ></ng-container>
                </ng-container>
                <ng-template #defaultCell>
                  <div
                    class="white-space-nowrap overflow-hidden text-overflow-ellipsis"
                    style="max-width: 200px"
                    [pTooltip]="row[col.field]"
                    tooltipPosition="top"
                  >
                    <span class="text-color-primary">{{ row[col.field] }}</span>
                  </div>
                </ng-template>
              </td>
              <td *ngIf="actionsTemplate" class="text-center body-cell">
                <ng-container
                  *ngTemplateOutlet="
                    actionsTemplate;
                    context: { $implicit: row }
                  "
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
                class="text-center py-8 text-500"
              >
                <i class="pi pi-folder-open block mb-3 text-4xl opacity-20"></i>
                <span class="font-medium">No results found</span>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      :host ::ng-deep {
        /* 1. MAIN TABLE PADDING & BORDERS */
        .p-datatable .p-datatable-thead > tr > th {
          padding: 1.25rem 1rem; /* Luxurious spacing for headers */
          background-color: #fcfcfd;
          border-bottom: 1px solid #edf2f7;
          font-weight: 600;
          color: black;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .p-datatable .p-datatable-tbody > tr > td {
          padding: 1.25rem 1rem; /* Increased row height for clarity */
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.925rem;
          // color: black;
        }

        /* 2. ROW HOVER & SELECTION */
        .p-datatable .p-datatable-tbody > tr:hover {
          background: #f8fafc !important;
          transition: background-color 0.2s ease;
        }

        /* 3. SEARCH INPUT ENHANCEMENT */
        .p-inputtext {
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          transition: all 0.2s ease;

          &:focus {
            background: #ffffff;
            border-color: var(--hms-primary);
            box-shadow: 0 0 0 4px var(--hms-primary-light);
          }
        }

        /* 4. PAGINATOR CLEANUP */
        .p-paginator {
          padding: 1.25rem;
          border-top: 1px solid #edf2f7;
          background: #ffffff;

          .p-paginator-pages .p-paginator-page.p-highlight {
            background: var(--hms-primary-light);
            color: var(--hms-primary);
          }
        }

        /* Checkbox alignment */
        .checkbox-cell {
          padding-left: 1.5rem !important;
        }
      }

      .table-header-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
      }

      .main-table-wrapper {
        background-color: #f1f5f9; /* Contrast background makes the white table pop */
        min-height: 100%;
      }
    `,
  ],
})
export class TableComponent<T = any> {
  // ... Inputs/Outputs stay exactly the same as your code
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() rows = 10;
  @Input() rowsPerPageOptions: number[] = [10, 20, 50];
  @Input() paginator = true;
  @Input() loading = false;
  @Input() globalFilterFields: string[] = [];
  @Input() showSearch = true;
  @Input() actionsTemplate: TemplateRef<unknown> | null = null;
  @Input() styleClass = 'p-datatable-sm';
  @Input() responsiveLayout = 'scroll';
  @Input() selection: T | T[] | null = null;
  @Output() selectionChange = new EventEmitter<T | T[]>();
  @Input() selectionMode: 'single' | 'multiple' | null = null;

  ngOnInit() {
    this.updateGlobalFilterFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) {
      this.updateGlobalFilterFields();
    }
  }

  private updateGlobalFilterFields() {
    // If globalFilterFields is empty or not provided, try to populate it from columns
    if (!this.globalFilterFields || this.globalFilterFields.length === 0) {
      if (this.columns && this.columns.length > 0) {
        this.globalFilterFields = this.columns.map((col) => col.field);
      }
    }
  }
}
