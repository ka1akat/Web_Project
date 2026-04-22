import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  username = '';
  password = '';
  message = '';
  isLoading = false;
  isError = false;
  showPassword = false;

  login(): void {
    if (!this.username || !this.password) {
      this.message = 'Please fill in all fields';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.isError = false;
    this.message = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message = 'Incorrect username or password';
        this.cdr.detectChanges();
      }
    });
  }
}
