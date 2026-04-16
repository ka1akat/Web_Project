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
  private storageKey = 'budgets';

  getBudgets(): Budget[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addBudget(budget: Budget): void {
    const budgets = this.getBudgets();
    budgets.push(budget);
    localStorage.setItem(this.storageKey, JSON.stringify(budgets));
  }

  deleteBudget(id: number): void {
    const budgets = this.getBudgets().filter(budget => budget.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(budgets));
  }
}
