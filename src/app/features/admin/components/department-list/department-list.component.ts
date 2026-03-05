import { Component, OnInit, effect } from '@angular/core';
import { AdminFacade } from '../../facades/admin.facade';
import { Department } from '../../../../core/models/department.model';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';
import { TableColumn } from '../../../../shared/models/table.model';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
})
export class DepartmentListComponent
  extends BaseCrudComponent<Department>
  implements OnInit
{
  permissions = PERMISSIONS;

  // Table Config
  cols: TableColumn<Department>[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' },
    // { field: 'headOfDepartmentName', header: 'Head of Dept' },
    { field: 'staffCount', header: 'Staff Count' },
    { field: 'active', header: 'Active' },
  ];

  constructor(private adminFacade: AdminFacade) {
    super();
    effect(() => {
      this.data = this.adminFacade.departments();
    });
  }

  override ngOnInit(): void {
    this.refreshData();
  }

  override refreshData() {
    this.adminFacade.loadDepartments();
  }

  override performDelete(item: Department): void {
    this.adminFacade.deleteDepartment(item.id);
  }

  override onSave(deptData: Department) {
    if (this.selectedItem) {
      const updated: Department = {
        ...deptData,
        id: this.selectedItem.id, // Ensure ID is preserved
      };
      this.adminFacade.updateDepartment(updated, () => {
        this.hideDialog();
      });
    } else {
      this.adminFacade.addDepartment(deptData, () => {
        this.hideDialog();
      });
    }
  }
}
