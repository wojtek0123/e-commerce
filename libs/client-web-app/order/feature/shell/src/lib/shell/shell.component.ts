import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  Signal,
  computed,
  inject,
} from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { StepService } from '@e-commerce/client-web-app/order/data-access';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-shell',
  standalone: true,
  imports: [StepsModule, ToastModule, RouterOutlet, ButtonModule],
  template: `
    <p-toast />
    <div class="max-width-1440px mx-auto">
      <p-steps class="mx-auto" [model]="stepLabels()" />
      <div class="container mt-6">
        <div class="w-full content">
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
  private stepService = inject(StepService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  @HostBinding('class') class = 'flex flex-column p-3';

  stepLabels: Signal<MenuItem[]> = computed(() =>
    [...this.stepService.stepConfiguration().keys()].map((key) => ({
      label: key.replaceAll('-', ' '),
      routerLink: `/${appRouterConfig.order.basePath}/${key}`,
    })),
  );

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (events) =>
            events instanceof NavigationStart && !events.url.includes('order'),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.stepService.resetStep();
      });
  }
}
