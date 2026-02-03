import { Component, OnInit } from '@angular/core';
import { Bed } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-bed-management',
  templateUrl: './bed-management.component.html',
  styleUrl: './bed-management.component.scss',
})
export class BedManagementComponent implements OnInit {
  beds: Bed[] = [];
  wards: { name: string; beds: Bed[] }[] = [];

  constructor() {}

  ngOnInit(): void {
    // Mock Data
    this.beds = [
      {
        id: 1,
        ward: 'General Ward',
        number: 'G-101',
        isOccupied: true,
        type: 'General',
      },
      {
        id: 2,
        ward: 'General Ward',
        number: 'G-102',
        isOccupied: false,
        type: 'General',
      },
      {
        id: 3,
        ward: 'General Ward',
        number: 'G-103',
        isOccupied: false,
        type: 'General',
      },
      { id: 4, ward: 'ICU', number: 'ICU-1', isOccupied: true, type: 'ICU' },
      { id: 5, ward: 'ICU', number: 'ICU-2', isOccupied: true, type: 'ICU' },
      {
        id: 6,
        ward: 'Private Ward',
        number: 'P-101',
        isOccupied: false,
        type: 'Private',
      },
    ];

    this.groupBedsByWard();
  }

  groupBedsByWard() {
    const wardMap = new Map<string, Bed[]>();

    this.beds.forEach((bed) => {
      if (!wardMap.has(bed.ward)) {
        wardMap.set(bed.ward, []);
      }
      wardMap.get(bed.ward)?.push(bed);
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
