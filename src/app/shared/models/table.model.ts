import { TemplateRef } from '@angular/core';

export interface TableColumn<T = unknown> {
  field: string;
  header: string;
  template?: TemplateRef<{ $implicit: unknown; row: T }>;
}
