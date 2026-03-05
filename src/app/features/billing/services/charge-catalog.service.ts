import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`${this.path}`, params)
      .pipe(map((res) => res.content || res));
  }
}
