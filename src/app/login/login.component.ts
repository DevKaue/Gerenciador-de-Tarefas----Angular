import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    // private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // this.loginForm = this.fb.group({
    //   email: ['', Validators.required],
    //   senha: ['', Validators.required]
    // });
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }
  
  get infoLogin() { return this.loginForm.controls; }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.authService.login({
      email: this.infoLogin['email'].value,
      senha: this.infoLogin['senha'].value
    }).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.error = err.message || 'Ocorreu um erro durante o login.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
