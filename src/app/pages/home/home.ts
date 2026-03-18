import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquivalenciaFormComponent, ResultadoEquivalencias } from '../../components/equivalencia-form/equivalencia-form';
import { ResultadoComponent } from '../../components/resultado/resultado';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EquivalenciaFormComponent, ResultadoComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {

  resultado: ResultadoEquivalencias | null = null;

  onResultado(dados: ResultadoEquivalencias | null): void {
    this.resultado = dados;
  }
}
