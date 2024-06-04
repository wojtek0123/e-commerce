import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAddress } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'lib-shell',
  standalone: true,
  imports: [StepsModule],
  template: `
    <div class="max-width-1440px mx-auto">
      <p-steps class="mx-auto" [model]="steps()" />
      <div class="container mt-6">
        <div class="content">
          <router-outlet />
        </div>
        <div class="cart">CART component</div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shell.component.css',
})
export class ShellComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @HostBinding('class') class = 'flex flex-column p-3';

  steps = signal<MenuItem[]>([
    {
      label: 'Address information',
      routerLink: 'address-information',
    },
    {
      label: 'Shipping',
      routerLink: 'shipping',
    },
    {
      label: 'payment',
      routerLink: 'payment',
    },
  ]).asReadonly();

  ngOnInit(): void {
    this.router.navigate(['/order/address-information'], { replaceUrl: true });
  }
}
