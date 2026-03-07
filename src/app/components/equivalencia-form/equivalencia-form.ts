import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquivalenciaService, AlimentoLista } from '../../services/equivalencia';
import { CalcularEquivalenciasRequest } from '../../models/calcular-equivalencias-request';

@Component({
  selector: 'app-equivalencia-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './equivalencia-form.html',
  styleUrls: ['./equivalencia-form.scss']
})
export class EquivalenciaFormComponent implements OnInit {

  @Output() resultado = new EventEmitter<any>();

  form!: FormGroup;
  carregando = false;
  carregandoAlimentos = false;
  mensagem = '';
  tipoMensagem: 'success' | 'error' | 'info' = 'info';

  grupos: string[] = [];
  alimentos: AlimentoLista[] = [];

  constructor(
    private fb: FormBuilder,
    private equivalenciaService: EquivalenciaService
  ) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.carregarGrupos();
  }

  inicializarForm(): void {
    this.form = this.fb.group({
      grupo: ['', [Validators.required]],
      alimentoId: ['', [Validators.required, Validators.min(1)]],
      quantidade: ['', [Validators.required, Validators.min(0.01)]]
    });

    // Quando o grupo mudar, buscar alimentos
    this.form.get('grupo')?.valueChanges.subscribe((grupo) => {
      if (grupo) {
        this.carregarAlimentos(grupo);
        this.form.get('alimentoId')?.reset();
      }
    });
  }

  carregarGrupos(): void {
    this.carregandoAlimentos = true;
    this.equivalenciaService.listarGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        this.carregandoAlimentos = false;
      },
      error: () => {
        this.carregandoAlimentos = false;
        this.exibirMensagem('Erro ao carregar grupos', 'error');
      }
    });
  }

  carregarAlimentos(grupo: string): void {
    this.carregandoAlimentos = true;
    this.equivalenciaService.listarAlimentosPorGrupo(grupo).subscribe({
      next: (alimentos) => {
        this.alimentos = alimentos;
        this.carregandoAlimentos = false;
      },
      error: () => {
        this.carregandoAlimentos = false;
        this.exibirMensagem('Erro ao carregar alimentos', 'error');
      }
    });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.exibirMensagem('Por favor, preencha todos os campos corretamente', 'error');
      return;
    }

    this.carregando = true;
    this.mensagem = '';

    const request: CalcularEquivalenciasRequest = {
      alimentoId: this.form.value.alimentoId,
      quantidade: this.form.value.quantidade
    };

    this.equivalenciaService.calcularEquivalencias(request).subscribe({
      next: (resposta) => {
        this.carregando = false;
        this.resultado.emit(resposta);
        this.exibirMensagem('Equivalências calculadas com sucesso!', 'success');
      },
      error: (erro) => {
        this.carregando = false;
        this.exibirMensagem('Erro ao calcular equivalências. Verifique os dados.', 'error');
        console.error(erro);
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
    setTimeout(() => {
      this.mensagem = '';
    }, 4000);
  }
}