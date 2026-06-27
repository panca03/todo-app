import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./task-list.component').then((c) => c.TaskListComponent),
  },
] as Routes;
