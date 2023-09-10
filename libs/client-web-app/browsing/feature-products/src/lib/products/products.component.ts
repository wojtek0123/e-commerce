import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  productsActions,
  selectProducts,
} from '@e-commerce/client-web-app/browsing/data-access';
import { CommonModule } from '@angular/common';
import { supabase } from 'libs/shared/data-access/src/lib/supabase';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'e-commerce-products',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  private store = inject(Store);
  products$ = this.store.select(selectProducts);

  ngOnInit(): void {
    this.store.dispatch(productsActions.getProducts());
  }

  getImage(imagePath: string) {
    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(imagePath);

    return publicUrl;
  }

  onAddToCart(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
