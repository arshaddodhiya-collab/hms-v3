import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  LabRequest,
  LabTest,
  CreateLabRequest,
  LabRequestStatus,
  AddLabResultRequest,
} from '../../../core/models/lab.models';

@Injectable({
  providedIn: 'root',
})
export class LabService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAllLabTests(): Observable<LabTest[]> {
    return this.http.get<LabTest[]>(`${this.apiUrl}/lab-tests`);
  }

  createLabRequest(request: CreateLabRequest): Observable<LabRequest> {
    return this.http.post<LabRequest>(`${this.apiUrl}/lab-requests`, request);
  }

  getLabQueue(
    status?: LabRequestStatus[],
    encounterId?: number,
  ): Observable<LabRequest[]> {
    let params = new HttpParams();
    if (status && status.length > 0) {
      status.forEach((s) => (params = params.append('status', s)));
    }
    if (encounterId) {
      params = params.append('encounterId', encounterId);
    }
    return this.http.get<LabRequest[]>(`${this.apiUrl}/lab-requests`, {
      params,
    });
  }

  getLabRequestById(id: number): Observable<LabRequest> {
    return this.http.get<LabRequest>(`${this.apiUrl}/lab-requests/${id}`);
  }

  updateStatus(id: number, status: LabRequestStatus): Observable<LabRequest> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<LabRequest>(
      `${this.apiUrl}/lab-requests/${id}/status`,
      {},
      { params },
    );
  }

  addResults(
    id: number,
    results: AddLabResultRequest[],
  ): Observable<LabRequest> {
    return this.http.post<LabRequest>(
      `${this.apiUrl}/lab-requests/${id}/results`,
      results,
    );
  }
}
