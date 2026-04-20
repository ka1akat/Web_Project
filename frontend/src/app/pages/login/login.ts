import { Component, inject } from '@angular/core';
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

  username = '';
  password = '';
  message = '';

  login(): void {
    this.message = 'Logging in...';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.message = 'Успешный вход ';
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.message = 'Login or password is not correct';
      }
    });
  }
}
