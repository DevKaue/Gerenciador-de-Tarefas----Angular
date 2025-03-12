import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginComponent } from "./login/login.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Gerente de Tarefas';
}
