import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquivalenciaService } from '../../services/equivalencia';
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
  mensagem = '';
  tipoMensagem: 'success' | 'error' | 'info' = 'info';

  constructor(
    private fb: FormBuilder,
    private equivalenciaService: EquivalenciaService
  ) { }

  ngOnInit(): void {
    this.inicializarForm();
  }

  inicializarForm(): void {
    this.form = this.fb.group({
      alimentoId: ['', [Validators.required, Validators.min(1)]],
      quantidade: ['', [Validators.required, Validators.min(0.01)]]
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