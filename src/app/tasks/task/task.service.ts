import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Task } from '../../auth/shared/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = 'http://seu-backend/api/tasks';
  
  constructor(private http: HttpClient) {}
  
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/GetTasks`)
      .pipe(
        catchError(error => {
          console.error('Erro ao obter tarefas:', error);
          return throwError(() => new Error('Falha ao carregar tarefas'));
        })
      );
  }
  
//   getTaskById(id: number): Observable<Task> {
//     return this.http.get<Task>(`${this.API_URL}/${id}`)
//       .pipe(
//         catchError(error => {
//           console.error(`Erro ao obter tarefa ${id}:`, error);
//           return throwError(() => new Error('Falha ao carregar detalhes da tarefa'));
//         })
//       );
//   }
  
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/CreateTasks`, task)
      .pipe(
        catchError(error => {
          console.error('Erro ao criar tarefa:', error);
          return throwError(() => new Error('Falha ao criar tarefa'));
        })
      );
  }
  
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/UpdateTasks/${task.id}`, task)
      .pipe(
        catchError(error => {
          console.error(`Erro ao atualizar tarefa ${task.id}:`, error);
          return throwError(() => new Error('Falha ao atualizar tarefa'));
        })
      );
  }
  
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/DeleteTasks/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Erro ao excluir tarefa ${id}:`, error);
          return throwError(() => new Error('Falha ao excluir tarefa'));
        })
      );
  }
}