import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-diagnosis-notes',
  templateUrl: './diagnosis-notes.component.html',
  styleUrls: ['./diagnosis-notes.component.scss'],
})
export class DiagnosisNotesComponent {
  @Input() diagnosis: string = '';
  @Output() diagnosisChange = new EventEmitter<string>();

  @Input() chiefComplaint: string = '';
  @Output() chiefComplaintChange = new EventEmitter<string>();

  @Input() notes: string = '';
  @Output() notesChange = new EventEmitter<string>();

  constructor() {}
}
