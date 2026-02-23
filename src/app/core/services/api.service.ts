import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl || 'http://localhost:3000/api'; // Fallback for dev

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  private getUrl(path: string): string {
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${this.baseUrl}/${cleanPath}`;
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(this.getUrl(path), {
      headers: this.getHeaders(),
      params,
    });
  }

  post<T>(
    path: string,
    body: unknown,
    params: HttpParams = new HttpParams(),
  ): Observable<T> {
    return this.http.post<T>(this.getUrl(path), JSON.stringify(body), {
      headers: this.getHeaders(),
      params,
    });
  }

  put<T>(
    path: string,
    body: unknown,
    params: HttpParams = new HttpParams(),
  ): Observable<T> {
    return this.http.put<T>(this.getUrl(path), JSON.stringify(body), {
      headers: this.getHeaders(),
      params,
    });
  }

  patch<T>(
    path: string,
    body: unknown,
    params: HttpParams = new HttpParams(),
  ): Observable<T> {
    return this.http.patch<T>(this.getUrl(path), JSON.stringify(body), {
      headers: this.getHeaders(),
      params,
    });
  }

  delete<T>(
    path: string,
    params: HttpParams = new HttpParams(),
  ): Observable<T> {
    return this.http.delete<T>(this.getUrl(path), {
      headers: this.getHeaders(),
      params,
    });
  }
}
