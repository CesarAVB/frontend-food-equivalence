import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquivalenciaResponse } from '../../models/equivalencia-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultado.html',
  styleUrls: ['./resultado.scss']
})
export class ResultadoComponent {

  @Input() dados: EquivalenciaResponse | null = null;
  // Ordenação controlada por coluna: 'descricao' (Alimento) ou 'quantidade' (Qtd g)
  sortField: 'descricao' | 'quantidade' = 'descricao';
  sortAsc = true; // true = asc, false = desc

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      this.ordenarResultados();
    }
  }

  obterEquivalentes() {
    if (!this.dados) return [];

    const equivalentes = [...this.dados.equivalentes];

    if (this.sortField === 'quantidade') {
      equivalentes.sort((a, b) => (a.quantidadeEquivalenteG - b.quantidadeEquivalenteG) * (this.sortAsc ? 1 : -1));
    } else {
      equivalentes.sort((a, b) => a.descricao.localeCompare(b.descricao, 'pt', { sensitivity: 'base' }) * (this.sortAsc ? 1 : -1));
    }
    
    return equivalentes;
  }

  ordenarResultados(): void {
    // Trigger change detection
  }

  toggleSort(field: 'descricao' | 'quantidade') {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
  }

  exportarCSV(): void {
    if (!this.dados) return;

    let csv = 'Alimento,Quantidade (g)\n';
    csv += `${this.dados.alimentoSelecionado.descricao},${this.dados.quantidade}\n\n`;
    csv += 'Equivalentes\n';
    csv += 'Alimento,Quantidade (g)\n';

    this.obterEquivalentes().forEach(equiv => {
      csv += `${equiv.descricao},${equiv.quantidadeEquivalenteG}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'equivalencias.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  copiarParaClipboard(texto: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      alert('Copiado para a área de transferência!');
    });
  }
}