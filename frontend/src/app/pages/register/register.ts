import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  message = '';

  register(): void {
    this.message = 'Registering...';

    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.message = 'Успешная регистрация ';
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.message = 'Ошибка регистрации ';
      }
    });
  }
}
