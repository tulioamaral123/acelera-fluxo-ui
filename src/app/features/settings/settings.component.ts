import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  loading = signal(false);
  success = signal(false);
  error = signal('');

  form = this.fb.group({
    jiraDomain: [''],
    jiraEmail: [''],
    jiraToken: [''],
    bitbucketWorkspace: [''],
    bitbucketToken: [''],
    pontoApiKey: [''],
    googleClientId: [''],
    googleClientSecret: [''],
    googleCalendarId: [''],
    googleRefreshToken: ['']
  });

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: (s) => this.form.patchValue(s),
      error: () => {}
    });
  }

  save(): void {
    this.loading.set(true);
    this.success.set(false);
    this.error.set('');

    this.settingsService.saveSettings(this.form.value as any).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => this.success.set(false), 3000);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Erro ao salvar configurações.');
        this.loading.set(false);
      }
    });
  }
}
