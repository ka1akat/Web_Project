import { Injectable } from '@angular/core';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  categoryId: number;
  note: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private storageKey = 'expenses';

  getExpenses(): Expense[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    expenses.push(expense);
    localStorage.setItem(this.storageKey, JSON.stringify(expenses));
  }

  deleteExpense(id: number): void {
    const expenses = this.getExpenses().filter(e => e.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(expenses));
  }
}
