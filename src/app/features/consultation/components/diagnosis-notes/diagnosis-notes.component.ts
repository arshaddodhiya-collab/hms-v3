import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-diagnosis-notes',
  templateUrl: './diagnosis-notes.component.html',
  styleUrls: ['./diagnosis-notes.component.scss'],
})
export class DiagnosisNotesComponent {
  @Input() diagnosis: string = '';
  @Input() chiefComplaint: string = '';
  @Input() notes: string = '';

  constructor() {}
}
