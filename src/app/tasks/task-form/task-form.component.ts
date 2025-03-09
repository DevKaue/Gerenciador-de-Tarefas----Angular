import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task/task.service';
import { Task } from '../../auth/shared/models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  // taskForm = this.fb.group({
  //   title: ['', [Validators.required]],
  //   description: [''],
  //   // dueDate: [null],
  //   // priority: ['média']
  // });
  public taskForm: FormGroup;
  
  loading = false;
  submitted = false;
  error = '';
  isEditMode = false;
  taskId?: number;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ){
    // this.taskForm = new FormGroup({
    //   title: new FormControl(''),
    //   description: new FormControl(''),
    //   completed: new FormControl('')
    // })
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      completed: [false]
    });
  }
  
  ngOnInit(): void {
    // Detectar modo de edição pelos parâmetros da rota
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });
  }
  
  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        // Formatar a data para o formato aceito pelo input type="date"
        // let formattedDate = null;
        // if (task.dueDate) {
        //   const date = new Date(task.dueDate);
        //   formattedDate = date.toISOString().split('T')[0];
        // }
        
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          // dueDate: formattedDate,
          // priority: task.priority || 'média'
        });
        
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar tarefa';
        this.loading = false;
      }
    });
  }
  
  get f() { return this.taskForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.taskForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const formValue = this.taskForm.getRawValue();
    
    const task: Task = {
      title: formValue.title as string,
      description: formValue.description as string,
      // dueDate: formValue.dueDate ? new Date(formValue.dueDate as string) : undefined,
      // priority: formValue.priority as 'baixa' | 'média' | 'alta',
      completed: false
    };
    
    if (this.isEditMode && this.taskId) {
      task.id = this.taskId;
      this.taskService.updateTask(task).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.error = 'Erro ao atualizar tarefa';
          this.loading = false;
        }
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.error = 'Erro ao criar tarefa';
          this.loading = false;
        }
      });
    }
  }
}
