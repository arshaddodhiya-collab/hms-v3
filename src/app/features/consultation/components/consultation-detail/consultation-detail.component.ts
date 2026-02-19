import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncounterResponse } from '../../../../core/models/encounter.model';
import { PrescriptionItem } from '../../../../core/models/prescription.model';
import { ConsultationFacade } from '../../facades/consultation.facade';

@Component({
  selector: 'app-consultation-detail',
  templateUrl: './consultation-detail.component.html',
  styleUrls: ['./consultation-detail.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultationDetailComponent implements OnInit {
  encounterId: number | null = null;
  appointmentId: number | null = null;
  patientName: string = '';

  diagnosis: string = '';
  notes: string = '';
  chiefComplaint: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public facade: ConsultationFacade,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const encParam = this.route.snapshot.paramMap.get('encounterId');
    const aptParam = this.route.snapshot.paramMap.get('appointmentId');

    if (encParam) {
      this.encounterId = +encParam;
      this.facade.loadEncounterById(this.encounterId);
      // Watch for encounter to populate form fields
      const checkEncounter = () => {
        const enc = this.facade.encounter();
        if (enc) {
          this.patientName = enc.patientName;
          this.diagnosis = enc.diagnosis || '';
          this.notes = enc.notes || '';
          this.chiefComplaint = enc.chiefComplaint || '';
        }
      };
      setTimeout(checkEncounter, 1000);
    } else if (aptParam) {
      this.appointmentId = +aptParam;
      this.facade.startEncounterFromAppointment(
        this.appointmentId,
        (encounter) => {
          this.patientName = encounter.patientName;
          this.diagnosis = encounter.diagnosis || '';
          this.notes = encounter.notes || '';
          this.chiefComplaint = encounter.chiefComplaint || '';
        },
        (msg) => this.errorAndRedirect(msg),
      );
    } else {
      this.errorAndRedirect('Invalid ID');
    }
  }

  get currentEncounter(): EncounterResponse | null {
    return this.facade.encounter();
  }

  onPrescriptionSave(items: PrescriptionItem[]) {
    const enc = this.facade.encounter();
    if (!enc) return;
    this.facade.savePrescription(enc.id, items);
  }

  saveDiagnosis() {
    const enc = this.facade.encounter();
    if (!enc) return;

    this.facade.updateClinicalNotes(enc.id, {
      chiefComplaint: this.chiefComplaint,
      diagnosis: this.diagnosis,
      notes: this.notes,
    });
  }

  finishConsultation() {
    const enc = this.facade.encounter();
    if (!enc) return;

    this.facade.finishConsultation(
      enc.id,
      {
        chiefComplaint: this.chiefComplaint,
        diagnosis: this.diagnosis,
        notes: this.notes,
      },
      () => {
        setTimeout(() => {
          this.router.navigate(['/consultation']);
        }, 500);
      },
    );
  }

  errorAndRedirect(msg: string) {
    console.error(msg);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: msg,
    });
    setTimeout(() => this.router.navigate(['/consultation']), 1000);
  }

  viewLabRequests() {
    const enc = this.facade.encounter();
    if (!enc) return;
    this.router.navigate(['/lab'], {
      queryParams: { encounterId: enc.id },
    });
  }
}
