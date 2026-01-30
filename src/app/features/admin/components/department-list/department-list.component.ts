import { Component, OnInit } from '@angular/core';
import { AdminService, Department } from '../../services/admin.service';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  permissions = PERMISSIONS;
  displayDialog = false;
  selectedDept: Department | null = null;
  dialogHeader = 'Create Department';

  // Table Config
  cols: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'head', header: 'Head of Dept' },
    { field: 'staffCount', header: 'Staff Count' },
  ];

  // Confirm Dialog State
  isConfirmOpen = false;
  deptToDeleteId: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.refreshDepartments();
  }

  refreshDepartments() {
    this.adminService.getDepartments().subscribe((data) => {
      this.departments = data;
    });
  }

  createDepartment(): void {
    this.selectedDept = null;
    this.dialogHeader = 'Create Department';
    this.displayDialog = true;
  }

  editDepartment(dept: Department): void {
    this.selectedDept = dept;
    this.dialogHeader = 'Edit Department';
    this.displayDialog = true;
  }

  deleteDepartment(id: string): void {
    this.deptToDeleteId = id;
    this.isConfirmOpen = true;
  }

  onConfirmDelete() {
    if (this.deptToDeleteId) {
      this.adminService.deleteDepartment(this.deptToDeleteId);
      this.deptToDeleteId = null;
    }
  }

  onCancelDelete() {
    this.deptToDeleteId = null;
    this.isConfirmOpen = false;
  }

  onSave(deptData: any) {
    if (this.selectedDept) {
      const updated: Department = {
        ...this.selectedDept,
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
    this.displayDialog = false;
  }

  onCancel() {
    this.displayDialog = false;
  }
}
