import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrescriptionComponent {
  @Input() medicines: any[] = [];
  @Output() save = new EventEmitter<any[]>();

  newMed = {
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
  };

  submitted = false;

  frequencies = [
    { label: '1-0-1 (Morning-Night)', value: '1-0-1' },
    { label: '1-1-1 (Morning-Noon-Night)', value: '1-1-1' },
    { label: '1-0-0 (Morning)', value: '1-0-0' },
    { label: '0-0-1 (Night)', value: '0-0-1' },
    { label: 'SOS (As needed)', value: 'SOS' },
  ];

  constructor(private messageService: MessageService) {}

  get isMedValid(): boolean {
    return !!(
      this.newMed.medicineName?.trim() &&
      this.newMed.dosage?.trim() &&
      this.newMed.frequency?.trim()
    );
  }

  addMedicine() {
    this.submitted = true;
    if (!this.isMedValid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Medicine name, dosage and frequency are required.',
      });
      return;
    }
    this.medicines.push({ ...this.newMed });
    this.newMed = { medicineName: '', dosage: '', frequency: '', duration: '' };
    this.submitted = false;
  }

  removeMedicine(index: number) {
    this.medicines.splice(index, 1);
  }

  savePrescription() {
    if (this.medicines.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Add at least one medicine before saving.',
      });
      return;
    }
    this.save.emit(this.medicines);
  }
}
