import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard';
import { AuthService } from '../../services/auth';
import { Chart, ArcElement, Tooltip, Legend, PieController, BarElement, BarController, CategoryScale, LinearScale } from 'chart.js';
import { VisaCardComponent } from '../../components/visa-card/visa-card';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  PieController,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, VisaCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dailyExpenseChart') dailyExpenseChartRef!: ElementRef<HTMLCanvasElement>;

  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private router = inject(Router);

  totalSpent = 0;
  expensesCount = 0;
  warningMessage = '';
  username = '';
  private pieChart?: Chart;
  private dailyChart?: Chart;

  ngOnInit(): void {
    this.loadUser();
    this.loadStatistics();
  }

  ngAfterViewInit(): void {
    this.renderCharts();
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


  private getUserStorageData(): { expenses: any[]; categories: any[] } {
    const username = localStorage.getItem('username') || 'guest';
    const expensesRaw =
      localStorage.getItem(`expenses_${username}`) || localStorage.getItem('expenses') || '[]';
    const categoriesRaw =
      localStorage.getItem(`categories_${username}`) || localStorage.getItem('categories') || '[]';

    return {
      expenses: JSON.parse(expensesRaw),
      categories: JSON.parse(categoriesRaw)
    };
  }

  renderCharts(): void {
    this.buildCategoryPieChart();
    this.buildDailyExpenseChart();
  }

  buildCategoryPieChart(): void {
    const { expenses, categories } = this.getUserStorageData();

    if (expenses.length === 0 || categories.length === 0) {
      this.pieChart?.destroy();
      return;
    }

 
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

    this.pieChart?.destroy();
    this.pieChart = new Chart(this.categoryChartRef.nativeElement, {
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

  buildDailyExpenseChart(): void {
    const { expenses } = this.getUserStorageData();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const totalsByDay: number[] = Array(daysInMonth).fill(0);
    expenses.forEach((expense: any) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
        totalsByDay[expenseDate.getDate() - 1] += Number(expense.amount);
      }
    });

    const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

    this.dailyChart?.destroy();
    this.dailyChart = new Chart(this.dailyExpenseChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Сумма расходов',
            data: totalsByDay,
            backgroundColor: '#4f46e5'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'День месяца'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Сумма'
            }
          }
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
