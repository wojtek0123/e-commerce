import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  model,
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  host: {
    class: 'flex items-center min-h-10 max-w-fit',
  },
})
export class SearchComponent {
  #breakpointObserver = inject(BreakpointObserver);

  searchText = model<string | null>(null);
  visible = signal(false);

  searchInputRef = viewChild.required<ElementRef>('searchInput');

  searchChanged = output<string>();

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

  clearInput() {
    this.searchInputRef().nativeElement?.focus();
    this.searchText.set(null);
  }

  show() {
    this.visible.set(true);
  }

  search() {
    this.searchChanged.emit(this.searchText()?.trim() ?? '');

    this.visible.set(false);
  }
}
