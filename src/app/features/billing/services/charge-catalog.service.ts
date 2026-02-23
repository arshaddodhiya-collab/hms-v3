import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

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
  private path = 'charge-catalog';

  constructor(private apiService: ApiService) {}

  getAllCharges(): Observable<ChargeCatalogResponse[]> {
    return this.apiService.get<ChargeCatalogResponse[]>(`${this.path}`);
  }
}
