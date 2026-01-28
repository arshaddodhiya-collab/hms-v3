import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-consultation-detail',
  templateUrl: './consultation-detail.component.html',
  styleUrls: ['./consultation-detail.component.scss'],
})
export class ConsultationDetailComponent implements OnInit {
  appointmentId: string | null = null;
  patient = {
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    id: 101,
    lastVisit: '2023-10-10',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
  }

  finishConsultation() {
    // Logic to save all data
    console.log('Consultation Finished');
    this.router.navigate(['/consultation']);
  }
}
