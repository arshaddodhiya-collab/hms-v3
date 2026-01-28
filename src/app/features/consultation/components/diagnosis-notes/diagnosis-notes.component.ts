import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-diagnosis-notes',
  templateUrl: './diagnosis-notes.component.html',
  styleUrls: ['./diagnosis-notes.component.scss'],
})
export class DiagnosisNotesComponent implements OnInit {
  @Input() diagnosis: string = '';
  @Input() chiefComplaint: string = '';
  @Input() notes: string = '';

  constructor() {}

  ngOnInit(): void {}
}
