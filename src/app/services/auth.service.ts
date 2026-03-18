import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

export interface Usuario {
  nome: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'usuario_logado';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.carregarDoStorage());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private router: Router, private notifier: NotificationService) {}

  get usuarioAtual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  get estaLogado(): boolean {
    return this.usuarioSubject.value !== null;
  }

  login(usuario: Usuario): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
    // Redireciona para a dashboard após login bem-sucedido
    this.router.navigate(['/home']);
    this.notifier.success('Login realizado com sucesso');
  }

  logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
    this.notifier.info('Você saiu da sessão');
  }

  private carregarDoStorage(): Usuario | null {
    try {
      const salvo = sessionStorage.getItem(this.STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  }
}
