import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

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
        console.log('FULL RESPONSE:', response);
        console.log('TOKEN SAVED:', token);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
      })
    );
  }

  register(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register/`, {
      username,
      password
    }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', username);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
}
