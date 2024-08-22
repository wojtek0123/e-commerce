import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  bookActions,
  bookSelector,
} from '@e-commerce/client-web/browse/data-access';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChipModule } from 'primeng/chip';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Book } from '@e-commerce/client-web/shared/data-access';
import { PanelModule } from 'primeng/panel';
import { MenuItem } from 'primeng/api';
import { DetailRowComponent } from '@e-commerce/client-web/browse/ui';
import { cartActions } from '@e-commerce/client-web/cart/data-access';

@Component({
  selector: 'lib-book',
  standalone: true,
  imports: [
    BreadcrumbModule,
    ChipModule,
    CurrencyPipe,
    InputNumberModule,
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    DetailRowComponent,
    DatePipe,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  public book = this.store.selectSignal(bookSelector.selectBook);
  public loading = this.store.selectSignal(bookSelector.selectLoading);
  public error = this.store.selectSignal(bookSelector.selectError);
  public availableQuantity = this.store.selectSignal(
    bookSelector.selectAvailableQuantity,
  );

  public breadcrumbs = computed<MenuItem[]>(() => [
    { label: 'Home', routerLink: '/' },
    { label: 'books', routerLink: '/browse' },
    {
      label: this.book()?.category.name ?? '',
      routerLink: '/browse',
      queryParams: { categories: this.book()?.category.name },
    },
    { label: this.book()?.title },
  ]);
  public amount = new FormControl<number>(1, {
    validators: [Validators.min(1)],
    nonNullable: true,
  });

  constructor() {
    effect(() => {
      this.amount.setValidators(Validators.max(this.availableQuantity()));
    });
  }

  public ngOnInit(): void {
    const bookId = Number(this.route.snapshot.params['bookId']);
    this.store.dispatch(bookActions.getBook({ bookId }));
  }

  public onBlurInput() {
    if (!this.amount.value) {
      this.amount.setValue(1);
    }
  }

  public addToCart() {
    if (!this.book()) return;

    this.store.dispatch(
      cartActions.addBookToCart({
        book: this.book()!,
        quantity: this.amount.value,
      }),
    );
  }
}
