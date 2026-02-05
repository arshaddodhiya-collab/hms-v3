import { TemplateRef } from '@angular/core';

export interface TableColumn<T = any> {
  field: string;
  header: string;
  template?: TemplateRef<{ $implicit: any; row: T }>;
}
