import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#f3f5f2]">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-[#164e3d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-slate-600 text-sm font-medium">Autenticando com Google...</p>
        @if (errorMsg) {
          <p class="mt-3 text-red-600 text-sm max-w-xs">{{ errorMsg }}</p>
          <a href="/login" class="mt-3 inline-block text-sm text-[#164e3d] underline">Voltar ao login</a>
        }
      </div>
    </div>
  `
})
export class GoogleCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);

  errorMsg = '';

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (!code) {
      this.errorMsg = 'Código de autorização não encontrado. Tente novamente.';
      return;
    }

    this.auth.exchangeGoogleCode(code).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Erro ao autenticar com Google. Tente novamente.';
      }
    });
  }
}
