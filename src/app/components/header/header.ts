import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioSessao } from '../../models/usuario';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  usuario$: Observable<UsuarioSessao | null> = this.auth.usuario$;

  get isAdmin(): boolean {
    return this.auth.isAdmin;
  }

  get isAdminOrNutricionista(): boolean {
    return this.auth.isAdminOrNutricionista;
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
