import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PontoRegistroDTO } from '../models/interfaces';

const API = 'http://localhost:8080/api/ponto';

@Injectable({ providedIn: 'root' })
export class PontoService {
  private http = inject(HttpClient);

  registrar(dto: PontoRegistroDTO): Observable<PontoRegistroDTO> {
    return this.http.post<PontoRegistroDTO>(`${API}/registrar`, dto);
  }

  getRegistrosHoje(): Observable<PontoRegistroDTO[]> {
    return this.http.get<PontoRegistroDTO[]>(`${API}/hoje`);
  }
}
