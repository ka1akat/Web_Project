import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private http: HttpClient, private router: Router) {}

  changePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') {
      alert('Session expired. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://127.0.0.1:8000/api/change-password/', {
      current_password: this.currentPassword,
      password: this.newPassword
    }, { headers }).subscribe({
      next: () => {
        alert('Password updated successfully');
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 401) {
          alert('Session expired. Please log in again.');
          this.router.navigate(['/login']);
          return;
        }

        const message = err?.error?.error || 'Failed to update password';
        alert(message);
      }
    });
  }
}
