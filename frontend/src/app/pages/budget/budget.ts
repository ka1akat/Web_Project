import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Budget, BudgetService } from '../../services/budget';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './budget.html',
  styleUrl: './budget.css'
})
export class BudgetComponent implements OnInit {
  amount: number | null = null;
  month: string = '';
  budgets: Budget[] = [];

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgets = this.budgetService.getBudgets();
  }

  saveBudget(): void {
    if (this.amount === null || this.amount <= 0 || this.month.trim() === '') {
      alert('Please fill all fields correctly');
      return;
    }

    // Проверяем, не установлен ли уже бюджет на этот месяц
    const existing = this.budgets.find(b => b.month === this.month);
    if (existing) {
      alert(`Бюджет на ${this.month} уже установлен. Удалите старый и добавьте новый.`);
      return;
    }

    const newBudget: Budget = {
      id: Date.now(),
      amount: this.amount,
      month: this.month.trim()
    };

    this.budgetService.addBudget(newBudget);
    this.loadBudgets();

    this.amount = null;
    this.month = '';
  }

  deleteBudget(id: number): void {
    this.budgetService.deleteBudget(id);
    this.loadBudgets();
  }
}
