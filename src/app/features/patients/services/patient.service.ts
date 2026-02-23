import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Patient } from '../../../core/models/patient.model';
import { Page } from '../../../core/models/page.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private path = 'patients';

  constructor(private apiService: ApiService) {}

  getPatients(
    query?: string,
    page: number = 0,
    size: number = 10,
  ): Observable<Page<Patient>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (query) {
      params = params.set('query', query);
    }

    return this.apiService.get<Page<Patient>>(this.path, params);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.apiService.get<Patient>(`${this.path}/${id}`);
  }

  registerPatient(patient: any): Observable<Patient> {
    return this.apiService.post<Patient>(this.path, patient);
  }

  updatePatient(id: number, patient: any): Observable<Patient> {
    return this.apiService.put<Patient>(`${this.path}/${id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}/${id}`);
  }

  // Helper method to calculate age from DOB if needed on client side
  calculateAge(dob: string): number {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
