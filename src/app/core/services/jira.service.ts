import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JiraResponse } from '../models/interfaces';

const API = 'http://localhost:8080/api/jira';

@Injectable({ providedIn: 'root' })
export class JiraService {
  private http = inject(HttpClient);

  getWeeklyTickets(): Observable<JiraResponse> {
    return this.http.get<JiraResponse>(`${API}/tickets`);
  }

  logWork(issueKey: string, timeSpent: string, comment?: string): Observable<any> {
    return this.http.post(`${API}/tickets/${issueKey}/worklog`, { timeSpent, comment });
  }
}
