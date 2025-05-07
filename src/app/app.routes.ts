import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    // { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { 
    path: 'tasks', 
    loadComponent: () => import('./tasks/task/task.component').then(m => m.TaskComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'tasks/list', 
    loadComponent: () => import('./tasks/task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard]
  },
  // { 
  //   path: 'tasks/new', 
  //   loadComponent: () => import('./tasks/task-form.component').then(m => m.TaskFormComponent),
  //   canActivate: [authGuard]
  // },
  // { 
  //   path: 'tasks/:id/edit', 
  //   loadComponent: () => import('./tasks/task-form.component').then(m => m.TaskFormComponent),
  //   canActivate: [authGuard]
  // },
  // { path: '**', redirectTo: '/tasks' }
];
