import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetricsDTO } from '../models/interfaces';

const API = 'http://localhost:8080/api/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getMetrics(): Observable<MetricsDTO> {
    return this.http.get<MetricsDTO>(`${API}/metrics`);
  }
}
