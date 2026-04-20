import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CalendarComponent } from './calendar/calendar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {

  isEditing = false;
  user: any = {};
  avatarUrl: string = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadAvatar();
  }

  loadAvatar(): void {
    const username = localStorage.getItem('username') || '';
    this.avatarUrl = localStorage.getItem(`avatar_${username}`) || '';
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const username = localStorage.getItem('username') || '';
      this.avatarUrl = reader.result as string;
      localStorage.setItem(`avatar_${username}`, this.avatarUrl);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  loadUser(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username') || '';

    const localProfile = JSON.parse(localStorage.getItem(`profile_${username}`) || '{}');

    this.user = {
      username,
      work: localProfile.work || '',
      university: localProfile.university || '',
      city: localProfile.city || ''
    };

    if (token && token !== 'undefined') {
      this.http.get('http://127.0.0.1:8000/api/user/', {
        headers: { Authorization: `Token ${token}` }
      }).subscribe({
        next: (data: any) => {
          this.user = { ...this.user, ...data };
          this.cdr.detectChanges();
        },
        error: () => {}
      });
    }
  }

  save(): void {
    const username = localStorage.getItem('username') || '';

    localStorage.setItem(`profile_${username}`, JSON.stringify({
      work: this.user.work,
      university: this.user.university,
      city: this.user.city
    }));

    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      this.http.put('http://127.0.0.1:8000/api/user/', this.user, {
        headers: { Authorization: `Token ${token}` }
      }).subscribe({
        next: () => alert('Profile updated'),
        error: () => alert('Saved locally')
      });
    } else {
      alert('Profile saved!');
    }

    this.isEditing = false;
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
      headers: { Authorization: `Token ${token}` }
    }).subscribe({
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
