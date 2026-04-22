import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard';
import { AuthService } from '../../services/auth';
import { Chart, ArcElement, Tooltip, Legend, PieController, DoughnutController, BarElement, BarController, CategoryScale, LinearScale } from 'chart.js';
import { VisaCardComponent } from '../../components/visa-card/visa-card';

Chart.register(
  ArcElement, Tooltip, Legend, PieController, DoughnutController,
  BarElement, BarController, CategoryScale, LinearScale
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
  quote = '';

  private quotes = [
    "A budget is telling your money where to go instead of wondering where it went.",
    "Do not save what is left after spending, but spend what is left after saving.",
    "Financial freedom is available to those who learn about it and work for it.",
    "The secret to getting ahead is getting started.",
    "Beware of little expenses; a small leak will sink a great ship.",
    "It's not about how much money you make, but how much money you keep.",
    "Rich people stay rich by living like they're broke. Broke people stay broke by living like they're rich.",
    "Money is a terrible master but an excellent servant.",
    "Wealth is not about having a lot of money; it's about having a lot of options.",
    "The habit of saving is itself an education.",
    "Don't work for money, make money work for you.",
    "Investing in yourself is the best investment you will ever make."
  ];

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
    const dayIndex = new Date().getDate() % this.quotes.length;
    this.quote = this.quotes[dayIndex];
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

    const labels = categories.filter((c: any) => totals[c.id] !== undefined).map((c: any) => c.name);
    const data = categories.filter((c: any) => totals[c.id] !== undefined).map((c: any) => totals[c.id]);

    const colors = [
      'rgba(255, 193, 7, 0.8)',
      'rgba(244, 67, 54, 0.75)',
      'rgba(76, 175, 80, 0.8)',
      'rgba(33, 150, 243, 0.8)',
      'rgba(156, 39, 176, 0.75)',
      'rgba(255, 87, 34, 0.8)',
      'rgba(0, 188, 212, 0.8)'
    ];

    this.pieChart?.destroy();
    this.pieChart = new Chart(this.categoryChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, data.length),
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#1a4a1e',  // ақ емес, қою жасыл
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1d3f1e',
            titleColor: '#9df896',
            bodyColor: '#e8f5e1'
          }
        },
        cutout: '60%'
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
        datasets: [{
          label: '',
          data: totalsByDay,
          backgroundColor: '#4a9e5c',
          borderColor: '#2e7d32',
          borderWidth: 1.5,
          borderRadius: 5,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1d3f1e',
            titleColor: '#9df896',
            bodyColor: '#e8f5e1',
            padding: 12,
            titleFont: { size: 14 },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          x: {
            ticks: { color: '#5a7d59', font: { size: 11 } },
            grid: { color: '#c8e6c9', display: true }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#5a7d59', font: { size: 11 } },
            grid: { color: '#c8e6c9' }
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

