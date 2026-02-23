import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private path = 'users';

  constructor(private apiService: ApiService) {}

  getDoctors(): Observable<any[]> {
    // Backend endpoint might be /users?role=DOCTOR or similar
    // Let's assume a dedicated endpoint or query param
    return this.apiService.get<any[]>(`${this.path}/doctors`);
  }
}
