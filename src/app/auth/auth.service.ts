import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User } from './shared/models/user.model';
import { LoginRequest, LoginResponse } from './shared/models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://127.0.0.1:8001';
  
  // Usando signals para estado de autenticação
  private currentUserSignal = signal<User | null>(null);
  public currentUser = computed(() => this.currentUserSignal());
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserToStorage();
  }
  
  private loadUserToStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUserSignal.set(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }
  
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          const user: User = {
            token: response.token
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSignal.set(user);
        }),
        catchError(error => {
          console.error('Erro de login:', error);
          return throwError(() => new Error(error.error?.message || 'Falha na autenticação'));
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }
  
  isAuthenticated(): boolean {
    return !!this.currentUserSignal()?.token;
  }
  
  getToken(): string | null {
    return this.currentUserSignal()?.token || null;
  }
}
