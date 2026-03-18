import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface Usuario {
  nome: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'usuario_logado';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.carregarDoStorage());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private router: Router) {}

  get usuarioAtual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  get estaLogado(): boolean {
    return this.usuarioSubject.value !== null;
  }

  login(usuario: Usuario): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
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
