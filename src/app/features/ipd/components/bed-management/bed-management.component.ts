import { Component, EventEmitter, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Admission, Bed } from '../../../../core/models/patient.model';
import { IpdService } from '../../services/ipd.service';

@Component({
  selector: 'app-bed-management',
  templateUrl: './bed-management.component.html',
  styleUrl: './bed-management.component.scss',
})
export class BedManagementComponent implements OnInit {
  beds: Bed[] = [];
  wards: { name: string; beds: Bed[] }[] = [];
  loading = false;

  constructor(private ipdService: IpdService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.loading = true;
    forkJoin({
      beds: this.ipdService.getBeds(),
      admissions: this.ipdService.getAdmissions(),
    }).subscribe(({ beds, admissions }) => {
      this.beds = beds;
      this.admissions = admissions;
      this.mapAdmissionsToBeds();
      this.groupBedsByWard();
      this.loading = false;
    });
  }

  admissions: Admission[] = [];
  bedAdmissionMap = new Map<number, Admission>();

  mapAdmissionsToBeds() {
    this.bedAdmissionMap.clear();
    this.admissions.forEach((a) => {
      if (a.bed && a.bed.id) {
        this.bedAdmissionMap.set(a.bed.id, a);
      }
    });
  }

  showAvailable = true;
  showOccupied = true;

  groupBedsByWard() {
    const wardMap = new Map<string, Bed[]>();

    this.beds.forEach((bed) => {
      // Filter Logic
      if (bed.isOccupied && !this.showOccupied) return;
      if (!bed.isOccupied && !this.showAvailable) return;

      // Handle potential null or structure mismatch
      const wardName = bed.ward?.name || 'Unknown Ward';
      if (!wardMap.has(wardName)) {
        wardMap.set(wardName, []);
      }
      wardMap.get(wardName)?.push(bed);
    });

    this.wards = [];
    wardMap.forEach((beds, name) => {
      this.wards.push({ name, beds });
    });
  }

  getAvailableCount(): number {
    return this.beds.filter((b) => !b.isOccupied).length;
  }

  getOccupiedCount(): number {
    return this.beds.filter((b) => b.isOccupied).length;
  }

  getAdmissionForBed(bedId: number): Admission | undefined {
    return this.bedAdmissionMap.get(bedId);
  }

  getBedStatusClass(bed: Bed): string {
    return bed.isOccupied ? 'occupied' : 'available';
  }

  // Round Form Logic
  showRoundForm = false;
  selectedAdmissionId: number | null = null;
  selectedPatientName = '';

  openRoundForm(bed: Bed) {
    const admission = this.getAdmissionForBed(bed.id);
    if (!admission && bed.isOccupied) {
      // Should ideally not happen if data is consistent, or maybe admission is not loaded yet?
      // Since we forkJoin, it should be there unless inconsistencies in DB.
      console.warn('Occupied bed with no linked local admission found:', bed);
      return;
    }

    if (admission) {
      this.selectedAdmissionId = admission.id;
      this.selectedPatientName = admission.patientName; // Admission model has patientName from mapper?
      // Check Admission model. It usually has patient object or patientName flattened.
      // IpdMapper.toAdmissionResponse maps patientName.
      // Let's verify Admission interface in frontend model.
      this.showRoundForm = true;
    }
  }

  onRoundSaved() {
    this.refreshData();
  }
}
