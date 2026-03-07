import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CalcularEquivalenciasRequest } from '../models/calcular-equivalencias-request';
import { EquivalenciaResponse } from '../models/equivalencia-response';

@Injectable({
  providedIn: 'root'
})
export class EquivalenciaService {

  private apiUrl = `${environment.apiUrl}/equivalencias`;

  constructor(private http: HttpClient) { }

  calcularEquivalencias(request: CalcularEquivalenciasRequest): Observable<EquivalenciaResponse> {
    return this.http.post<EquivalenciaResponse>(
      `${this.apiUrl}/equivalencias`,
      request
    );
  }
}