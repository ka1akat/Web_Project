import { Injectable } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private getKey(): string {
    const username = localStorage.getItem('username') || 'guest';
    return `categories_${username}`;
  }

  getCategories(): Category[] {
    const data = localStorage.getItem(this.getKey());
    return data ? JSON.parse(data) : [];
  }

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    localStorage.setItem(this.getKey(), JSON.stringify(categories));
  }

  deleteCategory(id: number): void {
    const categories = this.getCategories().filter(c => c.id !== id);
    localStorage.setItem(this.getKey(), JSON.stringify(categories));
  }
}
