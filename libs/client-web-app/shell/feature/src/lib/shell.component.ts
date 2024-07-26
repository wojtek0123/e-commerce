import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '@e-commerce/client-web-app/shell/ui/nav';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'lib-shell',
  imports: [RouterOutlet, NavComponent, ToastModule],
  template: `
    <lib-e-commerce-nav class="sticky top-0" />
    <p-toast />
    <div class="p-4 min-height-screen mx-auto">
      <router-outlet />
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {}
