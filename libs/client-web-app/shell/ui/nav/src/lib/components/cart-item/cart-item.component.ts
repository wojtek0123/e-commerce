import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'lib-cart-item',
  template: `
    <div
      class="flex flex-column min-w-max surface-ground p-3 border-round shadow-5 m-3"
    >
      <div class="flex align-items-center justify-content-between gap-3">
        <h3 class="text-2xl font-bold m-0">{{ item().book.title }}</h3>
        <h4
          class="text-center text-3xl m-0 flex align-items-center justify-content-center"
        >
          {{ '$' + item().book.price }}
        </h4>
      </div>
      <div class="flex align-items-center justify-content-between gap-3 mt-4">
        <div clas="flex flex-wrap">
          @for (author of item().book.authors; track author.id) {
          <div class="text-color-secondary">{{ author.name }}</div>
          }
        </div>
        <div class="flex align-items-center">
          <p-inputNumber
            [size]="2"
            [showButtons]="true"
            [(ngModel)]="item().quantity"
            (onBlur)="updateQuantity(item().id, item().quantity)"
            [min]="1"
            [maxlength]="10"
            buttonLayout="horizontal"
            spinnerMode="horizontal"
            inputId="integeronly"
            decrementButtonClass="p-button-text p-button-secondary"
            incrementButtonClass="p-button-text p-button-secondary"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
          <p-button
            icon="pi pi-trash"
            [text]="true"
            (onClick)="onDelete.emit({ cartId: item().id })"
          ></p-button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-inputtext {
          padding: 0 0.1rem;
          text-align: center;
        }
      }
    `,
  ],
  standalone: true,
  imports: [InputNumberModule, ButtonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  item = input.required<CartItem>();

  onUpdateQuantity = output<{
    cartId: CartItem['id'];
    quantity: CartItem['quantity'];
  }>();
  onDelete = output<{ cartId: CartItem['id'] }>();

  updateQuantity(cartId: CartItem['id'], quantity: CartItem['quantity']) {
    this.onUpdateQuantity.emit({ cartId, quantity });
  }
}
