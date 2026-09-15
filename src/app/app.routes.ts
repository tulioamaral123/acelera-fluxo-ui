import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'auth/callback', loadComponent: () => import('./features/auth/google-callback.component').then(m => m.GoogleCallbackComponent) },
  {
    path: '',
    loadComponent: () => import('./shared/layout/app-layout.component').then(m => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'jira', loadComponent: () => import('./features/jira/jira.component').then(m => m.JiraComponent) },
      { path: 'bitbucket', loadComponent: () => import('./features/bitbucket/bitbucket.component').then(m => m.BitbucketComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
