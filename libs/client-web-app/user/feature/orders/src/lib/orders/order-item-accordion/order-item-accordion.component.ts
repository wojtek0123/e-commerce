import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgOptimizedImage,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderDetails } from '@e-commerce/client-web-app/user/data-access';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-order-item-accordion-component',
  template: `
    <div
      class="flex align-items-center surface-hover border-round"
      [ngClass]="{ 'border-noround-bottom': isOpen() }"
    >
      <a
        [routerLink]="['/user', 'orders', order().id]"
        class="flex justify-content-between w-full p-4 cursor-pointer text-color no-underline"
      >
        <div class="flex flex-column gap-5">
          <span class="text-2xl text-color">{{ order().status }}</span>
          <span>{{ order().createdAt | date }}</span>
        </div>
        <div class="flex flex-column align-items-end gap-5">
          <span class="text-2xl font-bold text-color">
            {{ '$' + order().total.toFixed(2) }}
          </span>
          <span>no. {{ order().id }}</span>
        </div>
      </a>
      <p-button
        class="pr-1"
        (onClick)="togglePanel()"
        [icon]="isOpen() ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
        [text]="true"
      />
    </div>

    <div
      [@contentExpansion]="isOpen() ? 'expanded' : 'collapsed'"
      class="surface-hover px-4 border-round-bottom flex flex-column gap-2"
    >
      @for (item of order().orderItems; track item.id) {
        <div class="flex align-items-center content-item gap-4">
          <img
            [src]="item.book.coverImage ?? ''"
            height="160"
            width="110"
            [alt]="item.book.title + ' cover image'"
            class="border-round"
          />
          <div class="flex flex-column">
            <span class="text-2xl">{{ item.book.title }}</span>
            <span>{{ item.book.price | currency: 'USD' }}</span>
          </div>
        </div>
      }
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgOptimizedImage,
    NgClass,
    ButtonModule,
    RouterLink,
    CurrencyPipe,
  ],
  styles: [
    `
      .content-item:first-child {
        pading-top: 1.5rem;
      }

      .content-item:last-child {
        padding-bottom: 1.5rem;
      }
    `,
  ],
  animations: [
    trigger('contentExpansion', [
      state(
        'expanded',
        style({ height: '*', opacity: 1, visibility: 'visible' }),
      ),
      state(
        'collapsed',
        style({ height: '0px', opacity: 0, visibility: 'hidden' }),
      ),
      transition(
        'expanded <=> collapsed',
        animate('200ms cubic-bezier(.37,1.04,.68,.98)'),
      ),
    ]),
  ],
})
export class OrderItemAccordionComponent {
  order = input.required<OrderDetails>();

  isOpen = signal(false);

  togglePanel() {
    this.isOpen.update((prevState) => !prevState);
  }
}
