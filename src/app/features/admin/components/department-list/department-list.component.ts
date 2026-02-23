import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
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
    { field: 'headOfDepartmentName', header: 'Head of Dept' },
    { field: 'staffCount', header: 'Staff Count' },
    { field: 'active', header: 'Active' },
  ];

  constructor(private adminService: AdminService) {
    super();
  }

  override ngOnInit(): void {
    this.refreshData();
  }

  override refreshData() {
    this.adminService.getDepartments().subscribe((data: Department[]) => {
      this.data = data;
    });
  }

  override performDelete(item: Department): void {
    this.adminService.deleteDepartment(item.id).subscribe(() => {
      this.refreshData();
    });
  }

  override onSave(deptData: Department) {
    if (this.selectedItem) {
      const updated: Department = {
        ...deptData,
        id: this.selectedItem.id, // Ensure ID is preserved
      };
      this.adminService.updateDepartment(updated).subscribe(() => {
        this.refreshData();
        this.hideDialog();
      });
    } else {
      this.adminService.addDepartment(deptData).subscribe(() => {
        this.refreshData();
        this.hideDialog();
      });
    }
  }
}
