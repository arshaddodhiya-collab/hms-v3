import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
})
export class ConsultationComponent implements OnInit {
  appointmentId: string | null = null;
  patient: any = {
    name: 'Alice Johnson',
    age: 32,
    gender: 'Female',
    id: 'P-00123',
  };

  diagnosisNote: string = '';
  prescription: any[] = [];
  labTests: any[] = [];
  selectedTests: string[] = [];

  medicineName: string = '';
  medicineDosage: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.appointmentId = this.route.snapshot.paramMap.get('id');

    // Mock Data
    this.labTests = [
      { name: 'Complete Blood Count (CBC)', key: 'cbc' },
      { name: 'Lipid Profile', key: 'lipid' },
      { name: 'Blood Sugar (Fasting)', key: 'fbs' },
      { name: 'X-Ray Chest', key: 'xray' },
      { name: 'ECG', key: 'ecg' },
    ];
  }

  addMedicine() {
    if (this.medicineName && this.medicineDosage) {
      this.prescription.push({
        name: this.medicineName,
        dosage: this.medicineDosage,
      });
      this.medicineName = '';
      this.medicineDosage = '';
    }
  }

  removeMedicine(index: number) {
    this.prescription.splice(index, 1);
  }

  finishConsultation() {
    console.log('Consultation Finished', {
      diagnosis: this.diagnosisNote,
      prescription: this.prescription,
      tests: this.selectedTests,
    });
    // Navigate back or show success
  }
}
