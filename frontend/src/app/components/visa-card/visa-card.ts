import { Component, DoCheck, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-visa-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visa-card.html',
  styleUrl: './visa-card.css'
})
export class VisaCardComponent implements OnInit, DoCheck {
  private budgetService = inject(BudgetService);
  private expenseService = inject(ExpenseService);
  totalBalance = 0;
  lastDigits = '2026';
  private lastBudgetSnapshot = '';
  private lastExpenseSnapshot = '';

  ngOnInit(): void {
    this.updateBalance();
  }

  ngDoCheck(): void {
    const budgetSnapshot = localStorage.getItem('budgets') || '[]';
    const expenseSnapshot = localStorage.getItem('expenses') || '[]';

    if (budgetSnapshot !== this.lastBudgetSnapshot || expenseSnapshot !== this.lastExpenseSnapshot) {
      this.updateBalance();
    }
  }

  private updateBalance(): void {
    const budgets = this.budgetService.getBudgets();
    const expenses = this.expenseService.getExpenses();

    const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.amount), 0);
    const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    this.totalBalance = totalBudget - totalSpent;
    this.lastBudgetSnapshot = localStorage.getItem('budgets') || '[]';
    this.lastExpenseSnapshot = localStorage.getItem('expenses') || '[]';
  }
}
