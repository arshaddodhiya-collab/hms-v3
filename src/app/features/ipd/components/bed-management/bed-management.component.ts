import { Component, OnInit } from '@angular/core';
import { Bed } from '../../../../core/models/patient.model';
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
    this.ipdService.getBeds().subscribe((data) => {
      this.beds = data;
      this.groupBedsByWard();
      this.loading = false;
    });
  }

  groupBedsByWard() {
    const wardMap = new Map<string, Bed[]>();

    this.beds.forEach((bed) => {
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

  getBedStatusClass(bed: Bed): string {
    return bed.isOccupied ? 'occupied' : 'available';
  }
}
