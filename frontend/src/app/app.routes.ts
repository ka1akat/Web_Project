import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { CategoriesComponent } from './pages/categories/categories';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ExpensesComponent } from './pages/expenses/expenses';
import { BudgetComponent } from './pages/budget/budget';
import { Profile } from './pages/profile/profile';
import { ChangePasswordComponent } from './pages/change-password/change-password';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'profile', component: Profile },
  { path: 'change-password', component: ChangePasswordComponent }
];

