import { Component, OnInit } from '@angular/core';
import { AdminService, Department } from '../../services/admin.service';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';

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
  cols: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'head', header: 'Head of Dept' },
    { field: 'staffCount', header: 'Staff Count' },
  ];

  constructor(private adminService: AdminService) {
    super();
  }

  override ngOnInit(): void {
    this.refreshData();
  }

  override refreshData() {
    this.adminService.getDepartments().subscribe((data) => {
      this.data = data;
    });
  }

  override onSave(deptData: any) {
    if (this.selectedItem) {
      const updated: Department = {
        ...this.selectedItem,
        ...deptData,
      };
      this.adminService.updateDepartment(updated);
    } else {
      const newDept: Department = {
        id: 'DEPT-' + (Math.floor(Math.random() * 900) + 100),
        ...deptData,
      };
      this.adminService.addDepartment(newDept);
    }
    this.hideDialog();
  }

  override performDelete(item: Department): void {
    this.adminService.deleteDepartment(item.id);
  }
}
