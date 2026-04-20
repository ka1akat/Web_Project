import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Category, CategoryService } from '../../services/category';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  categoryName: string = '';
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories = this.categoryService.getCategories();
  }

  addCategory(): void {
    if (this.categoryName.trim() === '') {
      alert('Please enter category name');
      return;
    }

    const newCategory: Category = {
      id: Date.now(),
      name: this.categoryName.trim()
    };

    this.categoryService.addCategory(newCategory);
    this.loadCategories();
    this.categoryName = '';
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id);
    this.loadCategories();
  }
}
