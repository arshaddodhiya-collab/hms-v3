import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ChargeCatalogResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  serviceType: string;
  standardPrice: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChargeCatalogService {
  private apiUrl = `${environment.apiUrl}/charge-catalog`;

  constructor(private http: HttpClient) {}

  getAllCharges(): Observable<ChargeCatalogResponse[]> {
    return this.http.get<ChargeCatalogResponse[]>(`${this.apiUrl}`);
  }
}
