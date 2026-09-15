import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BitbucketService } from '../../core/services/bitbucket.service';
import { BitbucketRepo } from '../../core/models/interfaces';

@Component({
  selector: 'app-bitbucket',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bitbucket.component.html',
  styleUrl: './bitbucket.component.scss'
})
export class BitbucketComponent implements OnInit {
  private bitbucketService = inject(BitbucketService);

  repos = signal<BitbucketRepo[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.bitbucketService.getRepositories().subscribe({
      next: (res) => {
        this.repos.set(res.values ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Configure as credenciais Bitbucket nas configurações.');
        this.repos.set([]);
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }
}
