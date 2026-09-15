import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, EMPTY } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Endpoints onde um 401 deve propagar como erro normal (sem logout)
// São rotas de dados opcionais — a sessão ainda é válida mesmo sem acesso a esses serviços.
const DATA_ENDPOINTS = ['/api/calendar/', '/api/jira/', '/api/bitbucket/'];

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const cloned = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  if (!token && req.url.includes('localhost:8080') && !req.url.includes('/api/auth/')) {
    console.warn('[JWT] Requisição sem token para:', req.url);
  }

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && err.url?.includes('localhost:8080')) {
        const isDataEndpoint = DATA_ENDPOINTS.some(path => err.url?.includes(path));

        if (isDataEndpoint) {
          // Para endpoints de dados (calendário, jira, bitbucket), propaga o erro
          // para que o componente mostre uma mensagem amigável sem derrubar a sessão.
          console.warn('[JWT] 401 em endpoint de dados:', err.url);
          return throwError(() => err);
        }

        // Para outros endpoints, o 401 indica JWT inválido → logout
        console.warn('[JWT] 401 em endpoint protegido — fazendo logout:', err.url);
        sessionStorage.setItem('af_logout_reason', 'Sessão expirada. Faça login novamente.');
        auth.logout();
        return EMPTY;
      }
      return throwError(() => err);
    })
  );
};
