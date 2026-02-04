import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent {
  @Input() medicines: any[] = [];
  @Output() save = new EventEmitter<any[]>();

  newMed = {
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
  };

  frequencies = [
    { label: '1-0-1 (Morning-Night)', value: '1-0-1' },
    { label: '1-1-1 (Morning-Noon-Night)', value: '1-1-1' },
    { label: '1-0-0 (Morning)', value: '1-0-0' },
    { label: '0-0-1 (Night)', value: '0-0-1' },
    { label: 'SOS (As needed)', value: 'SOS' },
  ];

  constructor() {}

  addMedicine() {
    if (this.newMed.name && this.newMed.dosage) {
      this.medicines.push({ ...this.newMed });
      this.newMed = { name: '', dosage: '', frequency: '', duration: '' };
    }
  }

  removeMedicine(index: number) {
    this.medicines.splice(index, 1);
  }

  savePrescription() {
    this.save.emit(this.medicines);
  }
}
