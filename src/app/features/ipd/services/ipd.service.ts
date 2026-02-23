import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Admission, Bed } from '../../../core/models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class IpdService {
  private path = 'ipd';

  constructor(private apiService: ApiService) {}

  // Admissions
  getAdmissions(): Observable<Admission[]> {
    return this.apiService.get<Admission[]>(`${this.path}/admissions/active`);
  }

  getAdmissionById(id: number): Observable<Admission> {
    return this.apiService.get<Admission>(`${this.path}/admissions/${id}`);
  }

  admitPatient(admission: any): Observable<Admission> {
    return this.apiService.post<Admission>(
      `${this.path}/admissions`,
      admission,
    );
  }

  dischargePatient(admissionId: number, data: any): Observable<any> {
    return this.apiService.post<any>(
      `${this.path}/admissions/${admissionId}/discharge`,
      data,
    );
  }

  // Beds
  getBeds(): Observable<Bed[]> {
    return this.apiService.get<Bed[]>(`${this.path}/beds`);
  }

  getAvailableBeds(wardId: number): Observable<Bed[]> {
    const params = new HttpParams().set('wardId', wardId.toString());
    return this.apiService.get<Bed[]>(`${this.path}/beds/available`, params);
  }

  updateBedStatus(bedId: number, isActive: boolean): Observable<Bed> {
    const params = new HttpParams().set('isActive', isActive.toString());
    return this.apiService.patch<Bed>(
      `${this.path}/beds/${bedId}/status`,
      {},
      params,
    );
  }
  // Rounds
  addRound(data: any): Observable<any> {
    return this.apiService.post<any>(`encounters/rounds`, data);
  }
}
