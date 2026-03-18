import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Alimento } from '../models/alimento';
import { Page } from '../models/page';

@Injectable({ providedIn: 'root' })
export class AlimentoService {
  private readonly apiUrl = `${environment.apiUrl}/alimentos`;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 20, descricao?: string, grupo?: string): Observable<Page<Alimento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (descricao) params = params.set('descricao', descricao);
    if (grupo) params = params.set('grupo', grupo);
    return this.http.get<Page<Alimento>>(this.apiUrl, { params });
  }

  listarTodos(): Observable<Page<Alimento>> {
    return this.listar(0, 200);
  }

  listarPorGrupo(grupo: string): Observable<Page<Alimento>> {
    return this.listar(0, 200, undefined, grupo);
  }

  buscarPorId(id: number): Observable<Alimento> {
    return this.http.get<Alimento>(`${this.apiUrl}/${id}`);
  }

  criar(alimento: Partial<Alimento>): Observable<Alimento> {
    return this.http.post<Alimento>(this.apiUrl, alimento);
  }

  atualizar(id: number, alimento: Partial<Alimento>): Observable<Alimento> {
    return this.http.put<Alimento>(`${this.apiUrl}/${id}`, alimento);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
