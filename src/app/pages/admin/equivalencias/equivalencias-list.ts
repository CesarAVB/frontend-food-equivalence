import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquivalenciaService } from '../../../services/equivalencia.service';
import { AlimentoService } from '../../../services/alimento.service';
import { NotificationService } from '../../../services/notification.service';
import { Equivalencia } from '../../../models/equivalencia-response';
import { Alimento } from '../../../models/alimento';

@Component({
  selector: 'app-equivalencias-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './equivalencias-list.html',
  styleUrls: ['./equivalencias-list.scss']
})
export class EquivalenciasListComponent implements OnInit {
  equivalencias: Equivalencia[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  carregando = true;
  salvando = false;

  todosAlimentos: Alimento[] = [];
  equivalenciaEmEdicao: Equivalencia | null = null;
  modoEdicao = false;
  form!: FormGroup;

  readonly Math = Math;

  constructor(
    private equivalenciaService: EquivalenciaService,
    private alimentoService: AlimentoService,
    private notifier: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inicializarForm();
    this.alimentoService.listarTodos().subscribe({
      next: (page) => {
        this.todosAlimentos = page.content;
      }
    });
    this.carregar();
  }

  inicializarForm(eq?: Equivalencia): void {
    this.form = this.fb.group({
      alimentoOrigemId: [eq?.alimentoOrigemId ?? '', Validators.required],
      alimentoDestinoId: [eq?.alimentoDestinoId ?? '', Validators.required],
      fatorEquivalencia: [eq?.fatorEquivalencia ?? '', [Validators.required, Validators.min(0.0001)]],
      observacao: [eq?.observacao ?? '']
    });
  }

  carregar(): void {
    this.carregando = true;
    this.equivalenciaService.listar(this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.equivalencias = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.notifier.error('Erro ao carregar equivalências');
      }
    });
  }

  irParaPagina(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.carregar();
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  nomeAlimento(id: number): string {
    return this.todosAlimentos.find(a => a.id === id)?.descricao ?? `#${id}`;
  }

  grupoAlimento(id: number): string {
    return this.todosAlimentos.find(a => a.id === id)?.grupo ?? '—';
  }

  abrirModalCriar(): void {
    this.modoEdicao = false;
    this.equivalenciaEmEdicao = null;
    this.inicializarForm();
    this.abrirModal();
  }

  abrirModalEditar(eq: Equivalencia): void {
    this.modoEdicao = true;
    this.equivalenciaEmEdicao = eq;
    this.inicializarForm(eq);
    this.abrirModal();
  }

  private abrirModal(): void {
    const modal = document.getElementById('modalEquivalencia');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  fecharModal(): void {
    const modal = document.getElementById('modalEquivalencia');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.form.reset();
    this.equivalenciaEmEdicao = null;
    this.modoEdicao = false;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    const dados = {
      ...this.form.value,
      alimentoOrigemId: Number(this.form.value.alimentoOrigemId),
      alimentoDestinoId: Number(this.form.value.alimentoDestinoId),
      fatorEquivalencia: Number(this.form.value.fatorEquivalencia)
    };

    const operacao = this.modoEdicao && this.equivalenciaEmEdicao?.id
      ? this.equivalenciaService.atualizar(this.equivalenciaEmEdicao.id, dados)
      : this.equivalenciaService.criar(dados);

    operacao.subscribe({
      next: () => {
        this.salvando = false;
        this.notifier.success(this.modoEdicao ? 'Equivalência atualizada!' : 'Equivalência criada!');
        this.fecharModal();
        this.carregar();
      },
      error: (err) => {
        this.salvando = false;
        const msg = err.error?.message ?? 'Erro ao salvar equivalência';
        this.notifier.error(msg);
      }
    });
  }

  remover(eq: Equivalencia): void {
    if (!eq.id) return;
    const origem = this.nomeAlimento(eq.alimentoOrigemId);
    const destino = this.nomeAlimento(eq.alimentoDestinoId);
    if (!confirm(`Remover equivalência "${origem}" → "${destino}"?`)) return;

    this.equivalenciaService.remover(eq.id).subscribe({
      next: () => {
        this.notifier.success('Equivalência removida');
        this.carregar();
      },
      error: () => this.notifier.error('Erro ao remover equivalência')
    });
  }
}
