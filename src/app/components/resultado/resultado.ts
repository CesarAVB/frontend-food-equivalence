import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquivalenciaDetalhada } from '../../models/equivalencia-response';
import { Alimento } from '../../models/alimento';
import { ResultadoEquivalencias } from '../equivalencia-form/equivalencia-form';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultado.html',
  styleUrls: ['./resultado.scss']
})
export class ResultadoComponent {

  @Input() dados: ResultadoEquivalencias | null = null;
  sortField: 'nomeDestino' | 'fatorEquivalencia' = 'nomeDestino';
  sortAsc = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      this.sortField = 'nomeDestino';
      this.sortAsc = true;
    }
  }

  obterEquivalencias(): EquivalenciaDetalhada[] {
    if (!this.dados) return [];
    const lista = [...this.dados.equivalencias];
    if (this.sortField === 'fatorEquivalencia') {
      lista.sort((a, b) => (a.fatorEquivalencia - b.fatorEquivalencia) * (this.sortAsc ? 1 : -1));
    } else {
      lista.sort((a, b) => a.nomeDestino.localeCompare(b.nomeDestino, 'pt', { sensitivity: 'base' }) * (this.sortAsc ? 1 : -1));
    }
    return lista;
  }

  toggleSort(field: 'nomeDestino' | 'fatorEquivalencia') {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
  }

  get alimentoOrigem(): Alimento | null {
    return this.dados?.alimentoOrigem ?? null;
  }

  exportarCSV(): void {
    if (!this.dados) return;
    const origem = this.dados.alimentoOrigem;
    let csv = `Alimento de Origem;Grupo;Energia (kcal)\n`;
    csv += `${origem.descricao};${origem.grupo};${origem.energiaKcal}\n\n`;
    csv += `Equivalências\n`;
    csv += `Substituto;Grupo;Fator de Equivalência;Observação\n`;
    this.obterEquivalencias().forEach(eq => {
      csv += `${eq.nomeDestino};${eq.grupoDestino};${eq.fatorEquivalencia};${eq.observacao ?? ''}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equivalencias_${origem.descricao.replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
