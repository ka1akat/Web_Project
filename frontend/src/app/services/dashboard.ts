import { Injectable } from '@angular/core';
import { BudgetService } from './budget';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private budgetService: BudgetService) {}

  getStatistics(): { total_spent: number; count: number } {
    const username = localStorage.getItem('username') || 'guest';
    const data = localStorage.getItem(`expenses_${username}`);
    const expenses = data ? JSON.parse(data) : [];

    const total_spent = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
    const count = expenses.length;

    return { total_spent, count };
  }

  getWarnings(): string {
    const { total_spent } = this.getStatistics();
    const username = localStorage.getItem('username') || 'guest';
    const budgets = JSON.parse(localStorage.getItem(`budgets_${username}`) || '[]');
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentBudget = budgets.find((b: any) => b.month === currentMonth);

    if (!currentBudget) return 'Бюджет не установлен';

    const limit = currentBudget.amount;
    if (total_spent >= limit) return `⚠️ Бюджет превышен! Потрачено: ${total_spent} / ${limit}`;
    if (total_spent >= limit * 0.8) return `⚠️ Использовано 80% бюджета: ${total_spent} / ${limit}`;
    return `✅ В норме: ${total_spent} / ${limit}`;
  }
}
