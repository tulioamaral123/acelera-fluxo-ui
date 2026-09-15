import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isRegister = signal(false);
  loading = signal(false);
  errorMsg = signal('');
  sessionMsg = signal('');

  ngOnInit(): void {
    const reason = sessionStorage.getItem('af_logout_reason');
    if (reason) {
      this.sessionMsg.set(reason);
      sessionStorage.removeItem('af_logout_reason');
    }
  }

  form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  toggleMode(): void {
    this.isRegister.update(v => !v);
    this.errorMsg.set('');
    this.form.reset();
  }

  loginWithGoogle(): void {
    this.auth.getGoogleAuthUrl().subscribe({
      next: (res) => window.location.href = res.url,
      error: () => this.errorMsg.set('Erro ao iniciar autenticação com Google.')
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMsg.set('');

    const { email, password, name } = this.form.value;

    const obs = this.isRegister()
      ? this.auth.register({ name: name!, email: email!, password: password! })
      : this.auth.login({ email: email!, password: password! });

    obs.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Erro ao autenticar. Tente novamente.');
        this.loading.set(false);
      }
    });
  }
}
