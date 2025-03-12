import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User } from './shared/models/user.model';
import { LoginRequest, LoginResponse } from './shared/models/login.model';
import { environmentLogin } from '../../envirement';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = environmentLogin.apiUrl;
  user: any;
  // Usando signals para estado de autenticação
  private currentUserSignal = signal<User | null>(null);
  public currentUser = computed(() => this.currentUserSignal());
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // this.loadUserToStorage();
  }
  
  private loadUserToStorage(): void {
    // user = localStorage.setItem('user',this.user);
    const storedUser = localStorage.getItem('user');
    if(typeof window !== 'undefined')
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

          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSignal.set(user);
        }),
        catchError(error => {
          console.error('Erro de login:', error);
          return throwError(() => new Error(error.error?.message || 'Falha na autenticação'));
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  
  isAuthenticated(): boolean {
    return !!this.currentUserSignal()?.token;
  }
  
  getToken(): string | null {
    return this.currentUserSignal()?.token || null;
  }
}
