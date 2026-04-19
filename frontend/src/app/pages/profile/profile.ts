import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CalendarComponent } from './calendar/calendar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {

  isEditing = false;

  user: any = {};

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const token = localStorage.getItem('token');

    this.http.get('http://127.0.0.1:8000/api/user/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .subscribe({
      next: (data: any) => {
        console.log('USER DATA:', data);
        this.user = { ...data };
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.log('ERROR:', err);
      }
    });
  }

  save(): void {
    const token = localStorage.getItem('token');

    this.http.put('http://127.0.0.1:8000/api/user/', this.user, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .subscribe({
      next: () => {
        alert('Profile updated');
      },
      error: () => {
        alert('Error updating profile');
      }
    });
  }

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

    this.http.post('http://127.0.0.1:8000/api/change-password/', {
      current_password: this.currentPassword,
      password: this.newPassword
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .subscribe({
      next: () => {
        alert('Password updated successfully');

        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        localStorage.clear();             
        window.location.href = '/login';  
      },
      error: () => {
        alert('Current password is incorrect');
      }
    });
  }
}