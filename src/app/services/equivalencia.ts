import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CalcularEquivalenciasRequest } from '../models/calcular-equivalencias-request';
import { EquivalenciaResponse } from '../models/equivalencia-response';

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
  // POST - Calcular Equivalências
  // ====================================================

  calcularEquivalencias(request: CalcularEquivalenciasRequest): Observable<EquivalenciaResponse> {
    return this.http.post<EquivalenciaResponse>(
      `${this.apiUrl}/calcular`,
      request
    );
  }

  // ====================================================
  // GET - Listar Alimentos por Grupo
  // ====================================================

  /**
   * Busca alimentos de um grupo específico
   * GET /api/v1/equivalencias/alimentos/grupo/CEREAIS_E_DERIVADOS
   */
  listarAlimentosPorGrupo(grupo: string): Observable<AlimentoLista[]> {
    return this.http.get<AlimentoLista[]>(
      `${this.apiUrl}/alimentos/grupo/${grupo}`
    );
  }

  // ====================================================
  // GET - Listar Todos os Grupos
  // ====================================================

  /**
   * Retorna lista de grupos disponíveis
   * GET /api/v1/equivalencias/grupos
   */
  listarGrupos(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/grupos`
    );
  }

  // ====================================================
  // GET - Buscar Alimentos por Descrição
  // ====================================================

  /**
   * Busca alimentos por nome
   * GET /api/v1/equivalencias/alimentos/buscar?descricao=arroz
   */
  buscarAlimentos(descricao: string): Observable<AlimentoLista[]> {
    return this.http.get<AlimentoLista[]>(
      `${this.apiUrl}/alimentos/buscar`,
      { params: { descricao } }
    );
  }
}