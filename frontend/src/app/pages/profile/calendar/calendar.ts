import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../../services/expense';
import { BudgetService } from '../../../services/budget';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent implements OnInit {

  viewDate: Date = new Date();
  days: (number | null)[] = [];
  dayTotals: { [key: number]: number } = {};
  dayStatus: { [key: string]: 'good' | 'warning' | 'exceeded' } = {};

  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    this.generateCalendar();
    this.loadData();
  }

  generateCalendar() {
    this.days = [];
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) this.days.push(null);
    for (let i = 1; i <= daysInMonth; i++) this.days.push(i);
  }

  loadData() {
    const expenses = this.expenseService.getExpenses();
    const budgets = this.budgetService.getBudgets();

    // Берём бюджет текущего месяца (формат month: "2026-04")
    const currentMonth = this.viewDate.toISOString().slice(0, 7);
    const budget = budgets.find(b => b.month === currentMonth);
    const budgetLimit = budget ? budget.amount : 0;

    console.log('EXPENSES:', expenses);
    console.log('BUDGET:', budget, 'LIMIT:', budgetLimit);

    this.dayTotals = {};
    this.dayStatus = {};

    for (let exp of expenses) {
      const date = new Date(exp.date);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      if (month === this.viewDate.getMonth() && year === this.viewDate.getFullYear()) {
        if (!this.dayTotals[day]) this.dayTotals[day] = 0;
        this.dayTotals[day] += Number(exp.amount);
      }
    }

    // Считаем статус по той же логике что в бэкенде
    for (let day in this.dayTotals) {
      if (budgetLimit > 0) {
        const percent = (this.dayTotals[day] / budgetLimit) * 100;

        if (percent >= 50) {
          this.dayStatus[day] = 'exceeded'; // красный
        } else {
          this.dayStatus[day] = 'good'; // зелёный
        }
      }
    }

    console.log('DAY TOTALS:', this.dayTotals);
    console.log('DAY STATUS:', this.dayStatus);
  }

  prevMonth() {
    const d = new Date(this.viewDate);
    d.setMonth(d.getMonth() - 1);
    this.viewDate = d;
    this.generateCalendar();
    this.loadData();
  }

  nextMonth() {
    const d = new Date(this.viewDate);
    d.setMonth(d.getMonth() + 1);
    this.viewDate = d;
    this.generateCalendar();
    this.loadData();
  }
}
