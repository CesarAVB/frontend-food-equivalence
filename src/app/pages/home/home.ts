import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquivalenciaFormComponent } from '../../components/equivalencia-form/equivalencia-form';
import { ResultadoComponent } from '../../components/resultado/resultado';
import { EquivalenciaResponse } from '../../models/equivalencia-response';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EquivalenciaFormComponent, ResultadoComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {

  resultado: EquivalenciaResponse | null = null;

  onResultado(dados: EquivalenciaResponse): void {
    this.resultado = dados;
  }
}