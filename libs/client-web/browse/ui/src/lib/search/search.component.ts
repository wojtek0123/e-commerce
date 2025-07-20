import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DialogModule } from 'primeng/dialog';
import { NgTemplateOutlet } from '@angular/common';
import { LabelComponent } from '@e-commerce/client-web/shared/ui';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    NgTemplateOutlet,
    LabelComponent,
    OverlayBadgeModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  host: {
    class: 'flex items-center min-h-10 max-w-fit',
  },
})
export class SearchComponent implements OnInit {
  #breakpointObserver = inject(BreakpointObserver);

  initialSearchText = input<string | null>(null);
  visible = signal(false);

  searchText = linkedSignal(() => this.initialSearchText());

  searchInputRef = viewChild.required<ElementRef>('searchInput');

  searchChange = output<string | null>();

  hasValue = signal<boolean>(false);

  constructor() {
    this.#breakpointObserver
      .observe(`(max-width: 768px)`)
      .pipe(
        map((observe) => observe.matches),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.visible.set(false);
      });
  }

  ngOnInit(): void {
    this.hasValue.set(!!this.searchText()?.trim());
  }

  clearInput() {
    this.searchInputRef().nativeElement?.focus();
    this.searchText.set(null);

    if (window.innerWidth > 1280) {
      this.searchChange.emit(this.searchText()?.trim() ?? null);
    }
  }

  show() {
    this.visible.set(true);
  }

  search() {
    this.searchChange.emit(this.searchText()?.trim() ?? null);

    this.visible.set(false);

    this.hasValue.set(!!this.searchText()?.trim());
  }
}
