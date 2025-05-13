import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  userID: string;
  email: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7094';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private isAdminSubject = new BehaviorSubject<boolean>(this.checkAdmin());

  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();
  readonly isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token && response.userID && response.email) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.userID);
          localStorage.setItem('userEmail', response.email);
  
          this.setToken(response.token);
          this.updateAuthStatus();
        }
      }),
      catchError(this.handleError)
    );
  }
  
  
  

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearToken();
    this.updateAuthStatus();
  }

  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private clearToken(): void {
    localStorage.removeItem('authToken');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private checkAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'Admin' ||
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin';
    } catch (error) {
      console.error('Invalid token format', error);
      return false;
    }
  }

  private updateAuthStatus(): void {
    this.isLoggedInSubject.next(this.hasToken());
    this.isAdminSubject.next(this.checkAdmin());
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 0) {
      // Network error
      errorMessage = 'Cannot connect to the server. Please check your connection.';
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('AuthService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
