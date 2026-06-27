import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main/main-layout.component').then((c) => c.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      {
        path: 'tasks',
        loadChildren: () => import('./features/tasks/task.routes'),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./features/notifications/notification.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
