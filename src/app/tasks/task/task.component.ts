import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-task',
  imports: [],
  standalone: true,
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  constructor(
      private authService: AuthService,
    ){}

  logout(): void {    
    console.log('teste')
    this.authService.logout();
  }
}
