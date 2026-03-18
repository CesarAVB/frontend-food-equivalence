import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlimentoService } from '../../services/alimento.service';
import { EquivalenciaService } from '../../services/equivalencia.service';
import { Alimento, GRUPOS_ALIMENTARES } from '../../models/alimento';
import { Equivalencia, EquivalenciaDetalhada } from '../../models/equivalencia-response';

export interface ResultadoEquivalencias {
  alimentoOrigem: Alimento;
  equivalencias: EquivalenciaDetalhada[];
}

@Component({
  selector: 'app-equivalencia-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './equivalencia-form.html',
  styleUrls: ['./equivalencia-form.scss']
})
export class EquivalenciaFormComponent implements OnInit {

  @Output() resultado = new EventEmitter<ResultadoEquivalencias | null>();

  form!: FormGroup;
  carregando = false;
  carregandoAlimentos = false;
  mensagem = '';
  tipoMensagem: 'success' | 'error' | 'info' = 'info';

  readonly grupos = GRUPOS_ALIMENTARES;
  alimentos: Alimento[] = [];
  todosAlimentos: Alimento[] = [];

  constructor(
    private fb: FormBuilder,
    private alimentoService: AlimentoService,
    private equivalenciaService: EquivalenciaService
  ) {}

  ngOnInit(): void {
    this.inicializarForm();
    this.carregarTodosAlimentos();
  }

  inicializarForm(): void {
    this.form = this.fb.group({
      grupo: ['', [Validators.required]],
      alimentoId: ['', [Validators.required]]
    });

    this.form.get('grupo')?.valueChanges.subscribe((grupo) => {
      this.form.get('alimentoId')?.reset();
      this.alimentos = grupo
        ? this.todosAlimentos.filter(a => a.grupo === grupo)
        : [];
    });

    this.form.get('alimentoId')?.valueChanges.subscribe((id) => {
      if (id) {
        this.buscarEquivalencias(Number(id));
      }
    });
  }

  carregarTodosAlimentos(): void {
    this.carregandoAlimentos = true;
    this.alimentoService.listarTodos().subscribe({
      next: (page) => {
        this.todosAlimentos = page.content;
        this.carregandoAlimentos = false;
      },
      error: () => {
        this.carregandoAlimentos = false;
        this.exibirMensagem('Erro ao carregar alimentos', 'error');
      }
    });
  }

  buscarEquivalencias(alimentoId: number): void {
    this.carregando = true;
    this.mensagem = '';

    this.equivalenciaService.listarPorAlimento(alimentoId).subscribe({
      next: (equivalencias) => {
        this.carregando = false;
        const alimentoOrigem = this.todosAlimentos.find(a => a.id === alimentoId);
        if (!alimentoOrigem) return;

        const detalhadas: EquivalenciaDetalhada[] = equivalencias.map(eq => {
          const destino = this.todosAlimentos.find(a => a.id === eq.alimentoDestinoId);
          return {
            ...eq,
            nomeDestino: destino?.descricao ?? `Alimento #${eq.alimentoDestinoId}`,
            grupoDestino: destino?.grupo ?? '-',
            kcalDestino: destino?.energiaKcal ?? 0
          };
        });

        this.resultado.emit({ alimentoOrigem, equivalencias: detalhadas });

        if (detalhadas.length === 0) {
          this.exibirMensagem('Nenhuma equivalência cadastrada para este alimento.', 'info');
        } else {
          this.exibirMensagem(`${detalhadas.length} equivalência(s) encontrada(s).`, 'success');
        }
      },
      error: () => {
        this.carregando = false;
        this.exibirMensagem('Erro ao buscar equivalências.', 'error');
      }
    });
  }

  limpar(): void {
    this.form.reset();
    this.alimentos = [];
    this.mensagem = '';
    this.resultado.emit(null);
  }

  exibirMensagem(msg: string, tipo: 'success' | 'error' | 'info'): void {
    this.mensagem = msg;
    this.tipoMensagem = tipo;
    setTimeout(() => { this.mensagem = ''; }, 4000);
  }
}
