import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSettingsDTO } from '../models/interfaces';

const API = 'http://localhost:8080/api/settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);

  getSettings(): Observable<UserSettingsDTO> {
    return this.http.get<UserSettingsDTO>(API);
  }

  saveSettings(dto: UserSettingsDTO): Observable<UserSettingsDTO> {
    return this.http.put<UserSettingsDTO>(API, dto);
  }
}
