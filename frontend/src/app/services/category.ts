import { Injectable } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private storageKey = 'categories';

  getCategories(): Category[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    localStorage.setItem(this.storageKey, JSON.stringify(categories));
  }

  deleteCategory(id: number): void {
    const categories = this.getCategories().filter(category => category.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(categories));
  }
}
