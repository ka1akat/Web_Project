import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard';
import { AuthService } from '../../services/auth';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, PieController);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('categoryChart') chartRef!: ElementRef<HTMLCanvasElement>;

  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private router = inject(Router);

  totalSpent = 0;
  expensesCount = 0;
  warningMessage = '';
  username = '';

  ngOnInit(): void {
    this.loadUser();
    this.loadStatistics();
  }

  ngAfterViewInit(): void {
    this.buildChart();
  }

  loadUser(): void {
    this.username = localStorage.getItem('username') || 'User';
  }

  loadStatistics(): void {
    const stats = this.dashboardService.getStatistics();
    this.totalSpent = stats.total_spent;
    this.expensesCount = stats.count;
    this.warningMessage = this.dashboardService.getWarnings();
  }

  buildChart(): void {
    const username = localStorage.getItem('username') || 'guest';
    const expenses = JSON.parse(localStorage.getItem(`expenses_${username}`) || '[]');
    const categories = JSON.parse(localStorage.getItem(`categories_${username}`) || '[]');

    if (expenses.length === 0) return;

    // остальной код не меняй
    const totals: { [key: number]: number } = {};
    expenses.forEach((e: any) => {
      totals[e.categoryId] = (totals[e.categoryId] || 0) + Number(e.amount);
    });

    const labels = categories
      .filter((c: any) => totals[c.id] !== undefined)
      .map((c: any) => c.name);

    const data = categories
      .filter((c: any) => totals[c.id] !== undefined)
      .map((c: any) => totals[c.id]);

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#C9CBCF', '#7BC8A4'
    ];

    new Chart(this.chartRef.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, data.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
