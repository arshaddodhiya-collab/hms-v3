import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IpdFacade } from '../../facades/ipd.facade';

@Component({
  selector: 'app-round-form',
  templateUrl: './round-form.component.html',
  styleUrls: ['./round-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundFormComponent implements OnInit {
  @Input() display = false;
  @Input() admissionId: number | null = null;
  @Input() patientName: string = '';
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<void>();

  roundForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public facade: IpdFacade,
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

    const formValue = this.roundForm.value;
    const payload = {
      admissionId: this.admissionId,
      ...formValue,
    };

    this.facade.addRound(payload, () => {
      this.saved.emit();
      this.onHide();
    });
  }
}
