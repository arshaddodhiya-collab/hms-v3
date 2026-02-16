import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { TableModule } from 'primeng/table';
import { SimpleChange } from '@angular/core';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [TableModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should auto-populate globalFilterFields from columns if empty', () => {
    component.globalFilterFields = [];
    component.columns = [
      { field: 'name', header: 'Name' },
      { field: 'age', header: 'Age' },
    ];

    // Simulate ngOnInit
    component.ngOnInit();

    expect(component.globalFilterFields).toEqual(['name', 'age']);
  });

  it('should auto-populate globalFilterFields on columns change', () => {
    component.globalFilterFields = [];
    component.columns = [{ field: 'name', header: 'Name' }];

    // Simulate ngOnChanges
    component.ngOnChanges({
      columns: new SimpleChange(null, component.columns, true),
    });

    expect(component.globalFilterFields).toEqual(['name']);
  });

  it('should not overwrite globalFilterFields if provided', () => {
    component.globalFilterFields = ['custom'];
    component.columns = [
      { field: 'name', header: 'Name' },
      { field: 'age', header: 'Age' },
    ];

    component.ngOnInit();

    expect(component.globalFilterFields).toEqual(['custom']);
  });
});
