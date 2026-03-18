import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Equivalencia } from '../models/equivalencia-response';
import { Page } from '../models/page';

@Injectable({ providedIn: 'root' })
export class EquivalenciaService {
  private readonly apiUrl = `${environment.apiUrl}/equivalencias`;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 20): Observable<Page<Equivalencia>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Equivalencia>>(this.apiUrl, { params });
  }

  buscarPorId(id: string): Observable<Equivalencia> {
    return this.http.get<Equivalencia>(`${this.apiUrl}/${id}`);
  }

  listarPorAlimento(alimentoId: number): Observable<Equivalencia[]> {
    return this.http.get<Equivalencia[]>(`${this.apiUrl}/alimento/${alimentoId}`);
  }

  criar(equivalencia: Partial<Equivalencia>): Observable<Equivalencia> {
    return this.http.post<Equivalencia>(this.apiUrl, equivalencia);
  }

  atualizar(id: string, equivalencia: Partial<Equivalencia>): Observable<Equivalencia> {
    return this.http.put<Equivalencia>(`${this.apiUrl}/${id}`, equivalencia);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
