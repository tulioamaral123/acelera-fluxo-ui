import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/interfaces';

const API = 'http://localhost:8080/api/auth';
const TOKEN_KEY = 'af_token';
const USER_KEY = 'af_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/login`, body).pipe(
      tap(res => this.storeSession(res))
    );
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/register`, body).pipe(
      tap(res => this.storeSession(res))
    );
  }

  getGoogleAuthUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${API}/google`);
  }

  exchangeGoogleCode(code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/google/callback`, { code }).pipe(
      tap(res => this.storeSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): AuthResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private storeSession(res: AuthResponse): void {
    if (!res?.token) {
      console.error('[Auth] storeSession chamado sem token:', res);
      return;
    }
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res));
    this._isLoggedIn$.next(true);
    console.log('[Auth] Sessão armazenada para:', res.email);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
