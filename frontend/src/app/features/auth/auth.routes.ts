import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../../layouts/auth/auth-layout.component';

export default [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then((c) => c.RegisterComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
