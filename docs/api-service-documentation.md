# ApiService Documentation

**File Path:** `src/app/core/services/api.service.ts`

This document provides a comprehensive breakdown of the `ApiService` in the Angular frontend. It explains the purpose of the service, architectural decisions, and a detailed code-wise explanation.

---

## 1. What is the ApiService?

The `ApiService` is a **centralized wrapper** around Angular's native `HttpClient`. Instead of having every component or feature service inject `HttpClient` directly and reconstruct URLs and headers, they inject `ApiService`. 

### Problem it Solves
If developers use `HttpClient` directly across 50 different components:
1. They might forget to add `Content-Type: application/json`.
2. They will constantly hardcode `environment.apiUrl + '/endpoint'`.
3. If the backend changes its base URL structure, you would have to update 50 different files.

### Solution Approach
By routing all HTTP traffic through `ApiService`, we guarantee:
* **DRY (Don't Repeat Yourself)**: Headers and base URLs are defined in exactly one place.
* **Consistency**: Every outgoing request looks structurally identical.
* **Maintainability**: If we decide to add a global header (like a timezone or language preference header), we only add it to `api.service.ts`.

---

## 2. Code-Wise Explanation (Method Breakdown)

Let's break down the code logic block by block.

### A. Dependency Injection & Base Setup
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl || 'http://localhost:8080/api/v1';
  
  constructor(private http: HttpClient) {}
```
* `@Injectable({ providedIn: 'root' })`: This tells Angular to create exactly **one instance** (a Singleton) of this service for the entire application lifecycle. 
* `baseUrl`: It dynamically reads the base URL from Angular's environment files (`environment.ts` for dev, `environment.prod.ts` for prod). If it fails to load the environment variable, it falls back to Localhost port 8080.
* `constructor`: Injects Angular's core `HttpClient` so we can use its networking capabilities under the hood.

### B. Header Standardization
```typescript
private getHeaders(): HttpHeaders {
  return new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
}
```
* **Purpose**: This ensures every single request says, *"I am sending JSON to the backend"* (`Content-Type`) and *"I expect JSON back from the backend"* (`Accept`).
* Because it's a private method, it's enforced automatically inside this service without the caller needing to know about it.

### C. URL Formatting Protection
```typescript
private getUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${this.baseUrl}/${cleanPath}`;
}
```
* **Purpose**: This is a brilliant safety net against string-concatenation bugs. 
* **`path.startsWith('http')`**: If an external API is passed in (e.g., `https://api.github.com/users`), it skips the base URL to prevent broken links.
* **`startsWith('/')`**: If a developer accidentally calls `apiService.get('/patients')` instead of `apiService.get('patients')`, this strips the leading slash so the app doesn't accidentally call `http://localhost:8080/api/v1//patients` (double slashes can break REST APIs).

### D. The Core HTTP Verbs
```typescript
get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
  return this.http.get<T>(this.getUrl(path), {
    headers: this.getHeaders(),
    params,
  });
}

post<T>(path: string, body: unknown, params: HttpParams = new HttpParams()): Observable<T> {
  return this.http.post<T>(this.getUrl(path), JSON.stringify(body), {
    headers: this.getHeaders(),
    params,
  });
}
```
* **Generics (`<T>`)**: Notice the `get<T>` and `post<T>`. This allows the caller to strictly type the expected response. For example: `api.get<Patient[]>('patients')` guarantees an array of `Patient` objects.
* **`JSON.stringify(body)`**: Although Angular's `HttpClient` often auto-stringifies objects, explicitly doing `JSON.stringify` here guarantees that complex objects are formatted cleanly before hitting the network layer.
* **`HttpParams`**: It allows querying strings naturally. E.g., `api.get('patients', new HttpParams().set('status', 'active'))` cleanly translates to `/patients?status=active`.
* *The `put`, `patch`, and `delete` methods follow this exact same strict architecture.*

### E. Handling Special Data (Files/Blobs)
```typescript
getBlob(path: string, params: HttpParams = new HttpParams()): Observable<Blob> {
  return this.http.get(this.getUrl(path), {
    headers: this.getHeaders(),
    params,
    responseType: 'blob', // Critical for files!
  });
}
```
* **Why this exists**: You cannot download a PDF report or an Excel export from a standard JSON `get()` request. The browser will try to parse the raw byte code as JSON and throw a catastrophic syntax error.
* **`responseType: 'blob'`**: This tells Angular *"Do not try to read this as JSON. Keep it as raw binary data (a Blob)."* The component can then trigger a browser file download gracefully.

---

## 3. How it Connects to Interceptors

It is crucial to understand that **ApiService is the first step, not the last.**

When a component calls `this.apiService.get('patients')`:
1. **ApiService** formats the URL to `http://localhost:8080/api/v1/patients`.
2. It attaches `{ 'Content-Type': 'application/json' }`.
3. It hands the request to Angular's `HttpClient`.
4. **Before it hits the internet**, the `AuthInterceptor` intercepts it and seamlessly attaches `withCredentials: true` (for HttpOnly cookies).
5. The request leaves the browser.
6. The response comes back. If it's an error, the `ErrorInterceptor` intercepts it and shows a UI Toast.
7. Finally, the response data reaches the component that originally called it.

---

## 4. Possible Improvements for the Future

1. **Header Overrides**: Sometimes you need to upload `FormData` (like an Image file) where `Content-Type: application/json` is actually destructive. `ApiService` could be updated to accept an optional `customHeaders` object to override the defaults. Let `getHeaders(override?: HttpHeaders)` handle it.
2. **Global Caching Toggle**: You could add a specialized parameter (like `{ cache: true }`) so the service knows to utilize local memory caching for static lookups (like fetching a list of static states/countries).
