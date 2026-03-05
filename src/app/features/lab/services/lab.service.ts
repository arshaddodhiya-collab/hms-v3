import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`lab-tests`, params)
      .pipe(map((res) => res.content || res));
  }

  createLabRequest(request: CreateLabRequest): Observable<LabRequest> {
    return this.apiService.post<LabRequest>(`lab-requests`, request);
  }

  getLabQueue(
    status?: LabRequestStatus[],
    encounterId?: number,
  ): Observable<LabRequest[]> {
    let params = new HttpParams().set('size', '100');
    if (status && status.length > 0) {
      status.forEach((s) => (params = params.append('status', s)));
    }
    if (encounterId) {
      params = params.append('encounterId', encounterId);
    }
    return this.apiService
      .get<any>(`lab-requests`, params)
      .pipe(map((res) => res.content || res));
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
