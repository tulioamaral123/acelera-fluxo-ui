import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarEvent } from '../models/interfaces';

const API = 'http://localhost:8080/api/calendar';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private http = inject(HttpClient);

  getEvents(from: Date, to: Date): Observable<CalendarEvent[]> {
    const params = new HttpParams()
      .set('from', this.toIsoDate(from))
      .set('to', this.toIsoDate(to));
    return this.http.get<CalendarEvent[]>(`${API}/events`, { params });
  }

  private toIsoDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
