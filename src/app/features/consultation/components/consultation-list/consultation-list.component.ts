import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AuthService } from '../../../auth/services/auth.service';
import { ConsultationFacade } from '../../facades/consultation.facade';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultationListComponent implements OnInit, AfterViewInit {
  @ViewChild('patientNameTemplate') patientNameTemplate!: TemplateRef<any>;
  @ViewChild('ageTemplate') ageTemplate!: TemplateRef<any>;
  @ViewChild('priorityTemplate') priorityTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  permissions = PERMISSIONS;

  mappedQueue = computed(() => this.mapEncounters(this.facade.doctorQueue()));

  cols: any[] = [
    { field: 'patientName', header: 'Patient' },
    { field: 'age', header: 'Age/Gender' },
    { field: 'priority', header: 'Priority' },
    { field: 'startedAt', header: 'Wait Time' },
    { field: 'status', header: 'Status' },
  ];

  constructor(
    public facade: ConsultationFacade,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadQueues();
  }

  loadQueues() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.facade.loadDoctorQueue(currentUser.id);
  }

  // Map encounters to include computed age
  mapEncounters(encounters: any[]): any[] {
    return encounters.map((e) => ({
      ...e,
      age: this.calculateAge(e.patientDob),
      gender: e.patientGender,
      priority: e.priority || 'Normal',
      waitTime: e.startedAt,
    }));
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
