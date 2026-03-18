import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { AuthResponse } from '../models/auth-response';
import { UsuarioSessao } from '../models/usuario';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly STORAGE_KEY = 'usuario_logado';
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private usuarioSubject = new BehaviorSubject<UsuarioSessao | null>(this.carregarDoStorage());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private notifier: NotificationService
  ) {}

  get usuarioAtual(): UsuarioSessao | null {
    return this.usuarioSubject.value;
  }

  get estaLogado(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAdmin(): boolean {
    return this.usuarioAtual?.tipo === 'ADMIN';
  }

  get isAdminOrNutricionista(): boolean {
    const tipo = this.usuarioAtual?.tipo;
    return tipo === 'ADMIN' || tipo === 'NUTRICIONISTA';
  }

  fazerLogin(email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        const sessao: UsuarioSessao = { nome: res.nome, email: res.email, tipo: res.tipo };
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessao));
        this.usuarioSubject.next(sessao);
        this.router.navigate(['/home']);
        this.notifier.success('Login realizado com sucesso');
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
    this.notifier.info('Você saiu da sessão');
  }

  private carregarDoStorage(): UsuarioSessao | null {
    try {
      const salvo = sessionStorage.getItem(this.STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  }
}
