import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlimentoService } from '../../../services/alimento.service';
import { EquivalenciaService } from '../../../services/equivalencia.service';
import { UsuarioService } from '../../../services/usuario.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  totalAlimentos = 0;
  totalEquivalencias = 0;
  totalUsuarios = 0;
  carregando = true;

  get isAdmin(): boolean {
    return this.auth.isAdmin;
  }

  constructor(
    private auth: AuthService,
    private alimentoService: AlimentoService,
    private equivalenciaService: EquivalenciaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const requests: any = {
      alimentos: this.alimentoService.listar(0, 1),
      equivalencias: this.equivalenciaService.listar(0, 1)
    };

    if (this.isAdmin) {
      requests['usuarios'] = this.usuarioService.listar();
    }

    forkJoin(requests).subscribe({
      next: (res: any) => {
        this.totalAlimentos = res.alimentos?.totalElements ?? 0;
        this.totalEquivalencias = res.equivalencias?.totalElements ?? 0;
        this.totalUsuarios = res.usuarios?.length ?? 0;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }
}
