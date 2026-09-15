import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { PontoService } from '../../core/services/ponto.service';
import { CalendarService } from '../../core/services/calendar.service';
import { MetricsDTO, CalendarEvent } from '../../core/models/interfaces';
import { AuthService } from '../../core/services/auth.service';

interface WeekDay {
  date: Date;
  label: string;       // "Seg", "Ter"...
  dayNumber: string;   // "14"
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private pontoService = inject(PontoService);
  private calendarService = inject(CalendarService);
  private authService = inject(AuthService);

  metrics = signal<MetricsDTO | null>(null);
  loading = signal(false);
  userName = signal('');

  // Calendar
  weekOffset = signal(0);
  calendarEvents = signal<CalendarEvent[]>([]);
  calendarLoading = signal(false);
  calendarError = signal('');

  weekDays = computed<WeekDay[]>(() => {
    const events = this.calendarEvents();
    const monday = this.getMonday(this.weekOffset());
    const today = new Date();
    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const iso = date.toISOString().split('T')[0];
      return {
        date,
        label: labels[i],
        dayNumber: String(date.getDate()).padStart(2, '0'),
        isToday: iso === today.toISOString().split('T')[0],
        events: events.filter(e => e.date === iso)
      };
    });
  });

  weekLabel = computed<string>(() => {
    const days = this.weekDays();
    const first = days[0].date;
    const last  = days[6].date;
    const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    return `${fmt(first)} – ${fmt(last)} ${last.getFullYear()}`;
  });

  ngOnInit(): void {
    this.userName.set(this.authService.getUser()?.name?.split(' ')[0] ?? 'Usuário');
    this.loadMetrics();
    this.loadCalendar();
  }

  today(): string {
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  prevWeek(): void { this.weekOffset.update(o => o - 1); this.loadCalendar(); }
  nextWeek(): void { this.weekOffset.update(o => o + 1); this.loadCalendar(); }
  goToday(): void  { this.weekOffset.set(0); this.loadCalendar(); }

  loadCalendar(): void {
    this.calendarLoading.set(true);
    this.calendarError.set('');
    const monday = this.getMonday(this.weekOffset());
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    this.calendarService.getEvents(monday, sunday).subscribe({
      next: (events) => { this.calendarEvents.set(events); this.calendarLoading.set(false); },
      error: (err) => {
        const status: number = err?.status ?? 0;
        const msg: string = err?.error?.message ?? '';
        if (status === 401) {
          this.calendarError.set('Sessão do Google Calendar expirada. Faça logout e entre novamente com o Google.');
        } else {
          this.calendarError.set(msg || 'Configure o Google Calendar nas configurações.');
        }
        this.calendarLoading.set(false);
      }
    });
  }

  loadMetrics(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (m) => this.metrics.set(m),
      error: () => {}
    });
  }

  registrar(tipo: 'ENTRADA' | 'SAIDA'): void {
    this.loading.set(true);
    this.pontoService.registrar({ tipo }).subscribe({
      next: () => { this.loadMetrics(); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  private getMonday(offset: number): Date {
    const d = new Date();
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1 - day); // adjust to Monday
    d.setDate(d.getDate() + diff + offset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
