import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
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
  constructor(private apiService: ApiService) {}

  getAllLabTests(): Observable<LabTest[]> {
    return this.apiService.get<LabTest[]>(`lab-tests`);
  }

  createLabRequest(request: CreateLabRequest): Observable<LabRequest> {
    return this.apiService.post<LabRequest>(`lab-requests`, request);
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
    return this.apiService.get<LabRequest[]>(`lab-requests`, params);
  }

  getLabRequestById(id: number): Observable<LabRequest> {
    return this.apiService.get<LabRequest>(`lab-requests/${id}`);
  }

  updateStatus(id: number, status: LabRequestStatus): Observable<LabRequest> {
    const params = new HttpParams().set('status', status);
    return this.apiService.patch<LabRequest>(
      `lab-requests/${id}/status`,
      {},
      params,
    );
  }

  addResults(
    id: number,
    results: AddLabResultRequest[],
  ): Observable<LabRequest> {
    return this.apiService.post<LabRequest>(
      `lab-requests/${id}/results`,
      results,
    );
  }

  downloadLabReportPdf(id: number): Observable<Blob> {
    return this.apiService.getBlob(`lab-requests/${id}/pdf`);
  }
}
