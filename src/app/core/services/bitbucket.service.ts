import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BitbucketResponse } from '../models/interfaces';

const API = 'http://localhost:8080/api/bitbucket';

@Injectable({ providedIn: 'root' })
export class BitbucketService {
  private http = inject(HttpClient);

  getRepositories(): Observable<BitbucketResponse> {
    return this.http.get<BitbucketResponse>(`${API}/repos`);
  }
}
