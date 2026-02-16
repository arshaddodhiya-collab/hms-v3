import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IpdService } from '../../services/ipd.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-round-form',
  templateUrl: './round-form.component.html',
  styleUrls: ['./round-form.component.scss'],
})
export class RoundFormComponent implements OnInit {
  @Input() display = false;
  @Input() admissionId: number | null = null;
  @Input() patientName: string = '';
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<void>();

  roundForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private ipdService: IpdService,
    private messageService: MessageService,
  ) {
    this.roundForm = this.fb.group({
      notes: ['', Validators.required],
      // Vitals
      temperature: [null],
      systolic: [null],
      diastolic: [null],
      pulse: [null],
      spo2: [null],
    });
  }

  ngOnInit(): void {}

  onHide() {
    this.displayChange.emit(false);
    this.roundForm.reset();
  }

  save() {
    if (this.roundForm.invalid) return;

    if (!this.admissionId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No admission selected.',
      });
      return;
    }

    this.loading = true;
    const formValue = this.roundForm.value;
    const payload = {
      admissionId: this.admissionId,
      ...formValue,
    };

    this.ipdService.addRound(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Round added successfully.',
        });
        this.loading = false;
        this.saved.emit();
        this.onHide();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add round.',
        });
        this.loading = false;
      },
    });
  }
}
