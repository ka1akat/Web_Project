import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService, Expense } from '../../services/expense';
import { CategoryService, Category } from '../../services/category';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css'
})
export class ExpensesComponent implements OnInit {
  categories: Category[] = [];
  expenses: Expense[] = [];

  title = '';
  amount: number | null = null;
  date = '';
  categoryId: number | null = null;
  note = '';

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
    this.expenses = this.expenseService.getExpenses();
  }

  addExpense(): void {
    if (!this.title || !this.amount || !this.date || !this.categoryId) {
      alert('Заполните все обязательные поля');
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      title: this.title,
      amount: this.amount,
      date: this.date,
      categoryId: this.categoryId,
      note: this.note
    };

    this.expenseService.addExpense(newExpense);
    this.expenses = this.expenseService.getExpenses();
    this.resetForm();
  }

  deleteExpense(id: number): void {
    this.expenseService.deleteExpense(id);
    this.expenses = this.expenseService.getExpenses();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Неизвестно';
  }

  resetForm(): void {
    this.title = '';
    this.amount = null;
    this.date = '';
    this.categoryId = null;
    this.note = '';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
