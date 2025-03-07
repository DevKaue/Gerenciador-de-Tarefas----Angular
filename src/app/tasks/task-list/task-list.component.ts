import { Component, OnInit, signal } from '@angular/core';
import { Task } from '../../auth/shared/models/task.model';
import { TaskService } from '../task/task.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{
  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    this.loadTasks();
  }
  
  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Não foi possível carregar as tarefas');
        this.loading.set(false);
      }
    });
  }
  
  // toggleTaskStatus(task: Task): void {
  //   const updatedStatus = !task.completed;
    
  //   this.taskService.toggleTaskStatus(task.id!, updatedStatus).subscribe({
  //     next: (updatedTask) => {
  //       this.tasks.update(tasks => 
  //         tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
  //       );
  //     },
  //     error: (err) => {
  //       // Reverter a alteração na UI em caso de erro
  //       task.completed = !updatedStatus;
  //       console.error('Erro ao atualizar status:', err);
  //     }
  //   });
  // }
  
  confirmDeleteTask(task: Task): void {
    if (confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      this.deleteTask(task.id!);
    }
  }
  
  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.filter(task => task.id !== id));
      },
      error: (err) => {
        console.error('Erro ao excluir tarefa:', err);
        alert('Não foi possível excluir a tarefa. Tente novamente mais tarde.');
      }
    });
  }
  
  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta'
    };
    
    return labels[priority] || priority;
  }
}
