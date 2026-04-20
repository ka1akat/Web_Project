import { Injectable } from '@angular/core';

export interface Budget {
  id: number;
  amount: number;
  month: string;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private getKey(): string {
    const username = localStorage.getItem('username') || 'guest';
    return `budgets_${username}`;
  }

  getBudgets(): Budget[] {
    const data = localStorage.getItem(this.getKey());
    return data ? JSON.parse(data) : [];
  }

  addBudget(budget: Budget): void {
    const budgets = this.getBudgets();
    budgets.push(budget);
    localStorage.setItem(this.getKey(), JSON.stringify(budgets));
  }

  deleteBudget(id: number): void {
    const budgets = this.getBudgets().filter(b => b.id !== id);
    localStorage.setItem(this.getKey(), JSON.stringify(budgets));
  }
}
