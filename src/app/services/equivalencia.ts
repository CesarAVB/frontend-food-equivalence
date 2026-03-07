import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CalcularEquivalenciasRequest } from '../models/calcular-equivalencias-request';
import { EquivalenciaResponse } from '../models/equivalencia-response';

// ====================================================
// Interface - Alimento para Listar
// ====================================================
export interface AlimentoLista {
  id: number;
  descricao: string;
  grupo: string;
  energiaKcal: number;
}

@Injectable({
  providedIn: 'root'
})
export class EquivalenciaService {

  private apiUrl = `${environment.apiUrl}/equivalencias`;

  constructor(private http: HttpClient) { }

  // ====================================================
  // Métodos - Calcular Equivalências
  // ====================================================
  calcularEquivalencias(request: CalcularEquivalenciasRequest): Observable<EquivalenciaResponse> {
    return this.http.post<EquivalenciaResponse>(
      `${this.apiUrl}/calcular`,
      request
    );
  }

  // ====================================================
  // Métodos - Listar Grupos Disponíveis
  // ====================================================
  listarGrupos(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/grupos`
    );
  }

  // ====================================================
  // Métodos - Listar Alimentos por Grupo
  // ====================================================
  listarAlimentosPorGrupo(grupo: string): Observable<AlimentoLista[]> {
    const grupoEnum = this.converterGrupoParaEnum(grupo);
    return this.http.get<AlimentoLista[]>(
      `${this.apiUrl}/alimentos/grupo/${grupoEnum}`
    );
  }

  // ====================================================
  // Métodos - Buscar Alimentos por Descrição
  // ====================================================
  buscarAlimentos(descricao: string): Observable<AlimentoLista[]> {
    return this.http.get<AlimentoLista[]>(
      `${this.apiUrl}/alimentos/buscar`,
      { params: { descricao } }
    );
  }

  // ====================================================
  // Métodos Privados - Converter Grupo para Formato Enum
  // ====================================================
  private converterGrupoParaEnum(grupo: string): string {
    return grupo.toUpperCase().replace(/ /g, '_');
  }
}