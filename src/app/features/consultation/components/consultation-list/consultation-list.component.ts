import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { EncounterService } from '../../services/encounter.service';
import { AuthService } from '../../../auth/services/auth.service';
import { EncounterResponse } from '../../../../core/models/encounter.model';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.scss'],
})
export class ConsultationListComponent implements OnInit, AfterViewInit {
  @ViewChild('patientNameTemplate') patientNameTemplate!: TemplateRef<any>;
  @ViewChild('ageTemplate') ageTemplate!: TemplateRef<any>;
  @ViewChild('priorityTemplate') priorityTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  permissions = PERMISSIONS;
  consultationQueue: any[] = []; // Using any to mix Encounter with calculated fields
  loading = false;

  cols: any[] = [
    { field: 'patientName', header: 'Patient' },
    { field: 'age', header: 'Age/Gender' },
    { field: 'priority', header: 'Priority' },
    { field: 'startedAt', header: 'Wait Time' }, // Using startedAt as proxy for wait start
    { field: 'status', header: 'Status' },
  ];

  constructor(
    private encounterService: EncounterService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadQueue();
  }

  loadQueue() {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return; // Should handle not logged in

    this.encounterService.getDoctorQueue(currentUser.id).subscribe({
      next: (encounters) => {
        this.consultationQueue = encounters.map((e) => ({
          ...e,
          age: this.calculateAge(e.patientDob),
          gender: e.patientGender,
          priority: 'Normal', // TODO: Implement priority logic
          waitTime: e.startedAt, // Template can format relative time
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load consultation queue', err);
        this.loading = false;
      },
    });
  }

  calculateAge(dobString?: string): number | string {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  ngAfterViewInit() {
    const patientCol = this.cols.find((c) => c.field === 'patientName');
    if (patientCol) patientCol.template = this.patientNameTemplate;

    const ageCol = this.cols.find((c) => c.field === 'age');
    if (ageCol) ageCol.template = this.ageTemplate;

    const priorityCol = this.cols.find((c) => c.field === 'priority');
    if (priorityCol) priorityCol.template = this.priorityTemplate;

    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) statusCol.template = this.statusTemplate;
  }
}
