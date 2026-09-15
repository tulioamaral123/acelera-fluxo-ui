import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JiraService } from '../../core/services/jira.service';
import { JiraIssue } from '../../core/models/interfaces';

interface WorklogForm {
  timeSpent: string;
  comment: string;
}

@Component({
  selector: 'app-jira',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './jira.component.html',
  styleUrl: './jira.component.scss'
})
export class JiraComponent implements OnInit {
  private jiraService = inject(JiraService);

  issues        = signal<JiraIssue[]>([]);
  loading       = signal(false);
  error         = signal('');
  activeWorklog = signal<string | null>(null);
  worklogLoading = signal(false);
  worklogSuccess = signal(false);
  worklogError   = signal('');

  worklogForms: Record<string, WorklogForm> = {};

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.jiraService.getWeeklyTickets().subscribe({
      next: (res) => {
        const list = res.issues ?? [];
        this.issues.set(list);
        list.forEach(i => {
          if (!this.worklogForms[i.key]) {
            this.worklogForms[i.key] = { timeSpent: '', comment: '' };
          }
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Configure as credenciais Jira nas configurações.');
        this.issues.set([]);
        this.loading.set(false);
      }
    });
  }

  toggleWorklog(key: string): void {
    this.worklogSuccess.set(false);
    this.worklogError.set('');
    this.activeWorklog.set(this.activeWorklog() === key ? null : key);
  }

  submitWorklog(key: string): void {
    const form = this.worklogForms[key];
    if (!form?.timeSpent?.trim()) {
      this.worklogError.set('Informe o tempo gasto (ex: 1h 30m).');
      return;
    }
    this.worklogLoading.set(true);
    this.worklogError.set('');
    this.worklogSuccess.set(false);

    this.jiraService.logWork(key, form.timeSpent.trim(), form.comment).subscribe({
      next: () => {
        this.worklogSuccess.set(true);
        this.worklogLoading.set(false);
        form.timeSpent = '';
        form.comment   = '';
        setTimeout(() => {
          this.worklogSuccess.set(false);
          this.activeWorklog.set(null);
        }, 2000);
      },
      error: (err) => {
        this.worklogError.set(err?.error?.message ?? 'Erro ao registrar horas.');
        this.worklogLoading.set(false);
      }
    });
  }

  getRecentLogs(issue: JiraIssue) {
    return (issue.fields.worklog?.worklogs ?? [])
      .slice(-3)
      .reverse();
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('done') || s.includes('closed')) return 'bg-green-100 text-green-700';
    if (s.includes('progress') || s.includes('doing')) return 'bg-blue-100 text-blue-700';
    return 'bg-slate-100 text-slate-600';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }
}
