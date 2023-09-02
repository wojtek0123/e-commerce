import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { selectProducts } from '@e-commerce/client-web-app/browse/data-access';
import { productsActions } from '@e-commerce/client-web-app/browse/data-access';

@Component({
  selector: 'e-commerce-app-products',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  private readonly store = inject(Store);
  products$ = this.store
    .select(selectProducts)
    .pipe(tap((data) => console.log(data)));

  ngOnInit(): void {
    this.store.dispatch(productsActions.getProducts());
  }
}
