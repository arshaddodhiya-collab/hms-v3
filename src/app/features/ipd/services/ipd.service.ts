import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Admission, Bed } from '../../../core/models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class IpdService {
  private apiUrl = `${environment.apiUrl}/ipd`;

  constructor(private http: HttpClient) {}

  // Admissions
  getAdmissions(): Observable<Admission[]> {
    return this.http.get<Admission[]>(`${this.apiUrl}/admissions/active`);
  }

  getAdmissionById(id: number): Observable<Admission> {
    return this.http.get<Admission>(`${this.apiUrl}/admissions/${id}`);
  }

  admitPatient(admission: any): Observable<Admission> {
    return this.http.post<Admission>(`${this.apiUrl}/admissions`, admission);
  }

  dischargePatient(admissionId: number, data: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/admissions/${admissionId}/discharge`,
      data,
    );
  }

  // Beds
  getBeds(): Observable<Bed[]> {
    return this.http.get<Bed[]>(`${this.apiUrl}/beds`);
  }

  getAvailableBeds(wardId: number): Observable<Bed[]> {
    const params = new HttpParams().set('wardId', wardId.toString());
    return this.http.get<Bed[]>(`${this.apiUrl}/beds/available`, { params });
  }

  updateBedStatus(bedId: number, isActive: boolean): Observable<Bed> {
    const params = new HttpParams().set('isActive', isActive.toString());
    return this.http.patch<Bed>(
      `${this.apiUrl}/beds/${bedId}/status`,
      {},
      { params },
    );
  }
  // Rounds
  addRound(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/encounters/rounds`, data);
  }
}
