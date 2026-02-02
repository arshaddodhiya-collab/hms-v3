import { Component, OnInit } from '@angular/core';

@Component({
  template: '',
})
export abstract class BaseCrudComponent<T> implements OnInit {
  data: T[] = [];
  selectedItem: T | null = null;
  displayDialog: boolean = false;
  dialogHeader: string = '';
  loading: boolean = false;

  // Delete Confirmation State
  isConfirmOpen: boolean = false;
  itemToDelete: T | null = null;

  constructor() {}

  ngOnInit(): void {
    this.refreshData();
  }

  abstract refreshData(): void;

  openNew(header: string = 'Create New'): void {
    this.selectedItem = null;
    this.dialogHeader = header;
    this.displayDialog = true;
  }

  editItem(item: T, header: string = 'Edit Item'): void {
    this.selectedItem = { ...item };
    this.dialogHeader = header;
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.selectedItem = null;
  }

  // Abstract methods to be implemented by child components
  abstract onSave(item: any): void;

  // Optional: Common delete flow
  confirmDelete(item: T): void {
    this.itemToDelete = item;
    this.isConfirmOpen = true;
  }

  cancelDelete(): void {
    this.itemToDelete = null;
    this.isConfirmOpen = false;
  }

  // Child should override this for actual delete logic if using confirmDelete
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected performDelete(_: T): void {}

  onConfirmDelete(): void {
    if (this.itemToDelete) {
      this.performDelete(this.itemToDelete);
      this.cancelDelete();
    }
  }
}
