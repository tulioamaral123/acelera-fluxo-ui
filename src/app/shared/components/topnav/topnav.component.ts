import { Component, OnDestroy, OnInit, NgZone, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  currentTime = '';
  currentDate = '';
  private interval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.tick();
    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.tick();
        this.cdr.detectChanges();
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  private tick(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('pt-BR');
    this.currentDate = now.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  }
}
