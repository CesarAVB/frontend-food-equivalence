import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  usuario$: Observable<Usuario | null>;

  constructor(private auth: AuthService) {
    this.usuario$ = this.auth.usuario$;
  }

  iniciais(nome: string): string {
    return nome
      .split(' ')
      .slice(0, 2)
      .map(p => p[0].toUpperCase())
      .join('');
  }

  logout(): void {
    this.auth.logout();
  }
}
