import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login/`, {
      username,
      password
    }).pipe(
      tap((response: any) => {
        const token = response.token || response.key || response.auth_token;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
        }
      }),
      catchError((error) => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return throwError(() => error);
      })
    );
  }

  register(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register/`, {
      username,
      password
    }).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', username);
        }
      }),
      catchError((error) => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
}

