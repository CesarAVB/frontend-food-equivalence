import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { NotificationService } from '../../../services/notification.service';
import { Usuario, UsuarioTipo } from '../../../models/usuario';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './usuarios-list.html',
  styleUrls: ['./usuarios-list.scss']
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  carregando = true;
  salvando = false;

  filtroTexto = '';
  usuarioEmEdicao: Usuario | null = null;
  modoEdicao = false;
  form!: FormGroup;

  readonly tipos: UsuarioTipo[] = ['ADMIN', 'NUTRICIONISTA', 'PACIENTE'];

  constructor(
    private usuarioService: UsuarioService,
    private notifier: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inicializarForm();
    this.carregar();
  }

  inicializarForm(usuario?: Usuario): void {
    this.form = this.fb.group({
      nome: [usuario?.nome ?? '', [Validators.required, Validators.minLength(2)]],
      email: [usuario?.email ?? '', [Validators.required, Validators.email]],
      cpf: [usuario?.cpf ?? ''],
      senha: ['', usuario ? [] : [Validators.required, Validators.minLength(6)]],
      tipo: [usuario?.tipo ?? 'PACIENTE', Validators.required]
    });
  }

  carregar(): void {
    this.carregando = true;
    this.usuarioService.listar().subscribe({
      next: (lista) => {
        this.usuarios = lista;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.notifier.error('Erro ao carregar usuários');
      }
    });
  }

  get usuariosFiltrados(): Usuario[] {
    if (!this.filtroTexto.trim()) return this.usuarios;
    const termo = this.filtroTexto.toLowerCase();
    return this.usuarios.filter(u =>
      u.nome.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo) ||
      u.tipo.toLowerCase().includes(termo)
    );
  }

  abrirModalCriar(): void {
    this.modoEdicao = false;
    this.usuarioEmEdicao = null;
    this.inicializarForm();
    this.abrirModal();
  }

  abrirModalEditar(usuario: Usuario): void {
    this.modoEdicao = true;
    this.usuarioEmEdicao = usuario;
    this.inicializarForm(usuario);
    this.abrirModal();
  }

  private abrirModal(): void {
    const modal = document.getElementById('modalUsuario');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  fecharModal(): void {
    const modal = document.getElementById('modalUsuario');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.form.reset();
    this.usuarioEmEdicao = null;
    this.modoEdicao = false;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    const dados = { ...this.form.value };
    if (!dados.senha) delete dados.senha;
    if (!dados.cpf) delete dados.cpf;

    const operacao = this.modoEdicao && this.usuarioEmEdicao?.id
      ? this.usuarioService.atualizar(this.usuarioEmEdicao.id, dados)
      : this.usuarioService.criar(dados);

    operacao.subscribe({
      next: () => {
        this.salvando = false;
        this.notifier.success(this.modoEdicao ? 'Usuário atualizado!' : 'Usuário criado!');
        this.fecharModal();
        this.carregar();
      },
      error: (err) => {
        this.salvando = false;
        const msg = err.error?.message ?? (this.modoEdicao ? 'Erro ao atualizar' : 'Erro ao criar usuário');
        this.notifier.error(msg);
      }
    });
  }

  alternarAtivo(usuario: Usuario): void {
    if (!usuario.id) return;
    const operacao = usuario.ativo
      ? this.usuarioService.desativar(usuario.id)
      : this.usuarioService.ativar(usuario.id);

    operacao.subscribe({
      next: () => {
        this.notifier.success(usuario.ativo ? 'Usuário desativado' : 'Usuário ativado');
        this.carregar();
      },
      error: () => this.notifier.error('Erro ao alterar status do usuário')
    });
  }

  remover(usuario: Usuario): void {
    if (!usuario.id) return;
    if (!confirm(`Remover o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`)) return;

    this.usuarioService.remover(usuario.id).subscribe({
      next: () => {
        this.notifier.success('Usuário removido');
        this.carregar();
      },
      error: () => this.notifier.error('Erro ao remover usuário')
    });
  }

  tipoBadgeClass(tipo: UsuarioTipo): string {
    switch (tipo) {
      case 'ADMIN': return 'badge-admin';
      case 'NUTRICIONISTA': return 'badge-nutri';
      default: return 'badge-paciente';
    }
  }
}
